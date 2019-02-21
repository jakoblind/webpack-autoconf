import React from 'react'
import _ from 'lodash'

import { getDefaultProjectName } from '../configurator/configurator'

import styles from '../styles.module.css'
import '../vendor/prism-line-highlight.css'
import Prism from 'prismjs'
import memoizee from 'memoizee'
import {
  createWebpackConfig,
  getNpmDependencies,
} from '../configurator/configurator'
import { getDiffAsLineNumber } from '../configurator/Diff'
// disable prettier for now.
// import prettier from 'prettier/standalone'
// const parserBabylon = require('prettier/parser-babylon')

require('prismjs/themes/prism-tomorrow.css')
require('../vendor/PrismLineHighlight')

const FileList = ({ files, selectedFile, onSelectFile }) => {
  // sort with folders on top, and in alphabetic order
  const sortedFiles = _.chain(files)
    .map(({ highlightedFile }, filename) => ({ filename, highlightedFile }))
    .groupBy(({ filename }) => _.includes(filename, '/'))
    .mapValues(group => _.sortBy(group, 'filename'))
    .reduce((all, value, key) => _.concat(value, all), [])
    .value()

  // group adjacent files that are highlighted
  // so that we can highlight  more than one
  // file at the time
  const groupByHighlight = _.reduce(
    sortedFiles,
    (result, { filename, highlightedFile }) => {
      // get last group in list.
      const lastGroup = _.last(result)
      if (lastGroup && _.get(lastGroup, 'highlighted') === !!highlightedFile) {
        lastGroup.files.push(filename)
        return result
      } else {
        return _.concat(result, {
          highlighted: !!highlightedFile,
          files: [filename],
        })
      }
    },
    []
  )

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
  ))

  return (
    <div className={styles.files}>
      <ul>{filesElements}</ul>
    </div>
  )
}

class CodeBox extends React.Component {
  componentDidMount() {
    Prism.highlightAll()
  }
  componentDidUpdate(props) {
    if (
      props.code !== this.props.code ||
      props.highlightedLines !== this.props.highlightedLines
    ) {
      Prism.highlightAll()
    }
  }
  render() {
    const { code, highlightedLines } = this.props

    return (
      <div className={styles.codeBox}>
        <pre className={styles.codeBoxPre} data-line={highlightedLines}>
          <code className="language-javascript">{code}</code>
        </pre>
      </div>
    )
  }
}

const filenameRegex = /.+\./i
const extensionRegex = /\.[0-9a-z]+$/i

class FileBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: props.defaultSelection,
    }
    this.setSelectedFile = this.setSelectedFile.bind(this)
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

        const filename = this.state.selectedFile.match(filenameRegex)
        const newSelection = _.find(
          _.keys(this.props.fileContentMap),
          // we don't want to go from index.js to index.html
          file => _.startsWith(file, filename) && !_.endsWith(file, 'html')
        )
        this.setState({
          selectedFile: newSelection || this.props.defaultSelection,
        })
      }
    }
  }
  setSelectedFile(selectedFile) {
    this.setState({ selectedFile })
  }
  render() {
    const { fileContentMap } = this.props
    const fileContent = _.get(fileContentMap, this.state.selectedFile, '')

    const extension = this.state.selectedFile.match(extensionRegex)

    return (
      <div className={styles.fileBrowser}>
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
    )
  }
}
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
  getDiffAsLineNumberMemoized = memoizee(getDiffAsLineNumber)
  render() {
    const fileContentMap = _.mapValues(this.props.files, (content, name) => {
      let highlightedLines
      let highlightedFile = false
      // if the file didn't exist previously, highlight it all
      if (!content.previousContent) {
        highlightedFile = true
        const lines = content.currentContent.split(/\r\n|\r|\n/).length
        highlightedLines = `1-${lines}`
      } else if (content.previousContent !== content.currentContent) {
        highlightedFile = true
        highlightedLines = this.getDiffAsLineNumberMemoized(
          content.previousContent,
          content.currentContent
        )
      }

      return {
        content: content.currentContent,
        highlightedLines,
        highlightedFile,
      }
    })
    return (
      <FileBrowser
        fileContentMap={fileContentMap}
        defaultSelection={this.props.defaultSelection}
      />
    )
  }
}

class FileBrowserContainer extends React.Component {
  constructor(props) {
    super(props)

    const projectFiles = this.props.projectGeneratorFunction(
      this.props.features,
      'empty-project'
    )

    this.state = {
      projectFiles,
      projectFilesWithoutHighlightedFeature: projectFiles,
    }
  }
  /**
     load all version of dependencies (and cache them) used on page load
     to get a quicker loading speed when we show them.
  */
  loadAllDependencyVersions() {
    const npmConfigAllFeatures = getNpmDependencies(
      this.props.featureConfig,
      _.keys(this.props.featureConfig.features)
    )
    const allDependencies = _.concat(
      npmConfigAllFeatures.dependencies,
      npmConfigAllFeatures.devDependencies
    )
    _.forEach(allDependencies, dependency =>
      this.getNodeVersionPromise(dependency)
    )
  }
  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(this.props.highlightFeature, prevProps.highlightFeature) ||
      !_.isEqual(this.props.features, prevProps.features)
    ) {
      this.setProjectFilesInState()
    }
  }
  componentDidMount() {
    // fetch first without packagejson because package.json
    // is slow because we need to fetch versions.
    this.setProjectFilesInState()
    this.loadAllDependencyVersions()
  }
  getNodeVersionPromise = memoizee(name =>
    fetch(`https://unpkg.com/${name}/package.json`)
      .then(res => res.json())
      .then(
        r => {
          return '^' + r.version
        },
        { promise: true }
      )
  )
  getAllFeaturesExceptHighlighted = memoizee((features, highlightFeature) =>
    _.reject(features, f => f === highlightFeature)
  )
  setProjectFilesInState = () => {
    this.props
      .projectGeneratorFunction(
        this.props.features,
        'empty-project',
        this.getNodeVersionPromise
      )
      .then(files => {
        this.setState({ projectFiles: files })
        if (!this.props.highlightFeature) {
          // beacuse if there is no highligthed, then the previous content is the same as current content
          this.setState({ projectFilesWithoutHighlightedFeature: files })
        }
      })

    if (this.props.highlightFeature) {
      const featuresWithoutHighlighted = this.getAllFeaturesExceptHighlighted(
        this.props.features,
        this.props.highlightFeature
      )
      this.props
        .projectGeneratorFunction(
          featuresWithoutHighlighted,
          'empty-project',
          this.getNodeVersionPromise
        )
        .then(files => {
          this.setState({
            projectFilesWithoutHighlightedFeature: files,
          })
        })
    }
  }
  render() {
    const projectFiles = this.state.projectFiles

    const files = _.mapValues(projectFiles, (currentContent, file) => {
      let previousContent
      if (this.state.projectFilesWithoutHighlightedFeature[file]) {
        previousContent = this.state.projectFilesWithoutHighlightedFeature[file]
      }

      return {
        currentContent,
        previousContent,
      }
    })
    return (
      <FileBrowserTransformer
        defaultSelection={this.props.defaultFile || 'webpack.config.js'}
        files={files}
      />
    )
  }
}

export default FileBrowserContainer
