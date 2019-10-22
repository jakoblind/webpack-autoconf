import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../vendor/prism-line-highlight.css';
import Prism from 'prismjs';
import memoizee from 'memoizee';
import styles from '../styles.module.css';
import { getNpmDependencies } from '../configurator/configurator';
import { getDiffAsLineNumber } from '../configurator/Diff';
import npmVersionPromise from '../fetch-npm-version';

// disable prettier for now.
// import prettier from 'prettier/standalone'
// const parserBabylon = require('prettier/parser-babylon')

require('prismjs/themes/prism-tomorrow.css');
require('../vendor/PrismLineHighlight');

const FileList = ({ files, selectedFile, onSelectFile }) => {
  // sort with folders on top, and in alphabetic order
  const sortedFiles = _.chain(files)
    .map(({ highlightedFile }, filename) => ({ filename, highlightedFile }))
    .groupBy(({ filename }) => _.includes(filename, '/'))
    .mapValues(group => _.sortBy(group, 'filename'))
    .reduce((all, value, key) => _.concat(value, all), [])
    .value();

  // group adjacent files that are highlighted
  // so that we can highlight  more than one
  // file at the time
  const groupByHighlight = _.reduce(
    sortedFiles,
    (result, { filename, highlightedFile }) => {
      // get last group in list.
      const lastGroup = _.last(result);
      if (lastGroup && _.get(lastGroup, 'highlighted') === !!highlightedFile) {
        lastGroup.files.push(filename);
        return result;
      }
      return _.concat(result, {
        highlighted: !!highlightedFile,
        files: [filename],
      });
    },
    []
  );

  const filesElements = _.map(groupByHighlight, ({ highlighted, files }, i) => (
    <div className={highlighted ? styles.highlighted : null} key={i}>
      {_.map(files, file => (
        <li
          className={file === selectedFile ? styles.selected : null}
          key={file}
          onClick={() => onSelectFile(file)}
        >
          {file}
        </li>
      ))}
    </div>
  ));

  return (
    <div className={styles.files}>
      <ul>{filesElements}</ul>
    </div>
  );
};

FileList.propTypes = {
  files: PropTypes.shape({
    content: PropTypes.string,
    highlightedFile: PropTypes.bool,
  }).isRequired,
  selectedFile: PropTypes.string,
  onSelectFile: PropTypes.func.isRequired,
};

FileList.defaultProps = {
  selectedFile: '',
};

const extensionToPrismLanguage = {
  css: 'language-css',
  gitignore: 'language-markup',
  html: 'language-html',
  js: 'language-javascript',
  svelte: 'language-markup',
  ts: 'language-javascript',
  tsx: 'language-javascript',
  vue: 'language-markup',
};

class CodeBox extends React.Component {
  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate(props) {
    if (
      props.code !== this.props.code ||
      props.highlightedLines !== this.props.highlightedLines
    ) {
      Prism.highlightAll();
    }
  }

  render() {
    const { code, highlightedLines, extension } = this.props;
    const extKey = extension ? extension.substring(1) : null;
    const codeClassName = extensionToPrismLanguage[extKey] || '';

    return (
      <div className={styles.codeBox}>
        <pre className={styles.codeBoxPre} data-line={highlightedLines}>
          <code className={codeClassName}>{code}</code>
        </pre>
      </div>
    );
  }
}

CodeBox.propTypes = {
  code: PropTypes.string,
  extension: PropTypes.string,
  highlightedLines: PropTypes.string,
};

CodeBox.defaultProps = {
  code: '',
  extension: '',
  highlightedLines: '',
};

const filenameRegex = /.+\./i;
const extensionRegex = /\.[0-9a-z]+$/i;
class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: props.defaultSelection,
    };
    this.setSelectedFile = this.setSelectedFile.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.fileContentMap !== prevProps.fileContentMap) {
      if (
        !_.includes(_.keys(this.props.fileContentMap), this.state.selectedFile)
      ) {
        // if user has changed features which makes the currently
        // selected file not available anymore
        // then try to find another file with same file name
        // but different extension
        // for example if previous was index.js maybe new one is index.ts

        const filename = this.state.selectedFile.match(filenameRegex);
        const newSelection = _.find(
          _.keys(this.props.fileContentMap),
          // we don't want to go from index.js to index.html
          file => _.startsWith(file, filename) && !_.endsWith(file, 'html')
        );
        this.setState({
          selectedFile: newSelection || this.props.defaultSelection,
        });
      }
    }
  }

  setSelectedFile(selectedFile) {
    this.setState({ selectedFile });
    if (selectedFile === 'package.json') {
      this.props.onSelectPackageJson();
    }
  }

  render() {
    const { fileContentMap } = this.props;
    const fileContent = _.get(fileContentMap, this.state.selectedFile, '');
    const extensionMatch = this.state.selectedFile.match(extensionRegex);
    const extension = _.isArray(extensionMatch) ? extensionMatch[0] : null;

    return (
      <div className={styles.fileBrowser} id="file-browser">
        <FileList
          selectedFile={this.state.selectedFile}
          files={fileContentMap}
          onSelectFile={this.setSelectedFile}
        />
        <CodeBox
          extension={extension}
          code={fileContent.content}
          highlightedLines={fileContent.highlightedLines}
        />
      </div>
    );
  }
}

FileBrowser.propTypes = {
  fileContentMap: PropTypes.shape({
    content: PropTypes.string,
    highlightedFile: PropTypes.bool,
  }).isRequired,
  defaultSelection: PropTypes.string.isRequired,
  onSelectPackageJson: PropTypes.func.isRequired,
};
/*
 This component takes files as props.
  files is an object with file names as keys, and a map as value.
  the map contains previousContent and currentContent. It takes
  a diff of previous and current content and convert it to
  highlightedLines. if there was no previousContent then
  that means the file didn't exist before, that means
  the whole file should be highlighted
*/
class FileBrowserTransformer extends React.Component {
  getDiffAsLineNumberMemoized = memoizee(getDiffAsLineNumber);

  render() {
    const fileContentMap = _.mapValues(this.props.files, (content, name) => {
      let highlightedLines;
      let highlightedFile = false;
      // if the file didn't exist previously, highlight it all
      if (!content.previousContent) {
        highlightedFile = true;
        const lines = content.currentContent.split(/\r\n|\r|\n/).length;
        highlightedLines = `1-${lines}`;
      } else if (content.previousContent !== content.currentContent) {
        // highlightedFile = true
        highlightedLines = this.getDiffAsLineNumberMemoized(
          content.previousContent,
          content.currentContent
        );
      }

      return {
        content: content.currentContent,
        highlightedLines,
        highlightedFile,
      };
    });
    return (
      <FileBrowser
        onSelectPackageJson={this.props.onSelectPackageJson}
        fileContentMap={fileContentMap}
        defaultSelection={this.props.defaultSelection}
      />
    );
  }
}

FileBrowserTransformer.propTypes = {
  files: PropTypes.shape({
    content: PropTypes.string,
    highlightedFile: PropTypes.bool,
  }).isRequired,
  onSelectPackageJson: PropTypes.func.isRequired,
  defaultSelection: PropTypes.string.isRequired,
};

class FileBrowserContainer extends React.Component {
  constructor(props) {
    super(props);

    const projectFiles = this.props.projectGeneratorFunction(
      this.props.features,
      'empty-project'
    );

    this.state = {
      projectFiles,
      projectFilesWithoutHighlightedFeature: projectFiles,
    };
  }

  /**
     load all version of dependencies (and cache them) used on page load
     to get a quicker loading speed when we show them.
  */
  loadAllDependencyVersions() {
    const npmConfigAllFeatures = getNpmDependencies(
      this.props.featureConfig,
      _.keys(this.props.featureConfig.features)
    );
    const allDependencies = _.concat(
      npmConfigAllFeatures.dependencies,
      npmConfigAllFeatures.devDependencies
    );
    _.forEach(allDependencies, dependency => npmVersionPromise(dependency));
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(this.props.highlightFeature, prevProps.highlightFeature) ||
      !_.isEqual(this.props.features, prevProps.features) ||
      !_.isEqual(this.props.featureConfig, prevProps.featureConfig)
    ) {
      this.setProjectFilesInState();
    }
  }

  componentDidMount() {
    // fetch first without packagejson because package.json
    // is slow because we need to fetch versions.
    this.setProjectFilesInState();
    this.loadAllDependencyVersions();
  }

  getAllFeaturesExceptHighlighted = memoizee((features, highlightFeature) =>
    _.reject(features, f => f === highlightFeature)
  );

  setProjectFilesInState = () => {
    this.props
      .projectGeneratorFunction(
        this.props.features,
        'empty-project',
        npmVersionPromise
      )
      .then(files => {
        this.setState({ projectFiles: files });
        if (!this.props.highlightFeature) {
          // beacuse if there is no highligthed, then the previous content is the same as current content
          this.setState({ projectFilesWithoutHighlightedFeature: files });
        }
      });

    if (this.props.highlightFeature) {
      const featuresWithoutHighlighted = this.getAllFeaturesExceptHighlighted(
        this.props.features,
        this.props.highlightFeature
      );
      this.props
        .projectGeneratorFunction(
          featuresWithoutHighlighted,
          'empty-project',
          npmVersionPromise
        )
        .then(files => {
          this.setState({
            projectFilesWithoutHighlightedFeature: files,
          });
        });
    }
  };

  render() {
    const { projectFiles } = this.state;
    const files = _.mapValues(projectFiles, (currentContent, file) => {
      let previousContent;
      if (this.state.projectFilesWithoutHighlightedFeature[file]) {
        previousContent = this.state.projectFilesWithoutHighlightedFeature[
          file
        ];
      }

      return {
        currentContent,
        previousContent,
      };
    });
    return (
      <FileBrowserTransformer
        onSelectPackageJson={() => this.setProjectFilesInState()}
        defaultSelection={this.props.defaultFile}
        files={files}
      />
    );
  }
}

FileBrowserContainer.propTypes = {
  files: PropTypes.shape({
    content: PropTypes.string,
    highlightedFile: PropTypes.bool,
  }),
  defaultFile: PropTypes.string,

  featureConfig: PropTypes.shape({
    features: PropTypes.shape({}).isRequired,
  }).isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlightFeature: PropTypes.string,
  projectGeneratorFunction: PropTypes.func.isRequired,
};
FileBrowserContainer.defaultProps = {
  defaultFile: 'webpack.config.js',
  files: {},
  highlightFeature: '',
};

export default FileBrowserContainer;
