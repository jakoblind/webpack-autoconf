import React from 'react'
import _ from 'lodash'

import { getPackageJson, getDefaultProjectName } from './configurator'

import projectGenerator from './project-generator'
import styles from './styles.module.css'
import './prism-line-highlight.css'
import Prism from 'prismjs'
import memoizee from 'memoizee'
import { createWebpackConfig, getNpmDependencies } from './configurator'
import { getDiffAsLineNumber } from './Diff'
// disable prettier for now.
// import prettier from 'prettier/standalone'
// const parserBabylon = require('prettier/parser-babylon')

require('prismjs/themes/prism-tomorrow.css')
require('./PrismLineHighlight')

const FileList = ({ files, selectedFile, onSelectFile }) => {
  const filesElements = _.map(files, file => (
    <li
      className={file === selectedFile ? styles.selected : ''}
      key={file}
      onClick={() => onSelectFile(file)}
    >
      {file}
    </li>
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
        this.setState({ selectedFile: this.props.defaultSelection })
      }
    }
  }
  setSelectedFile(selectedFile) {
    this.setState({ selectedFile })
  }
  render() {
    const { fileContentMap } = this.props
    const content = _.get(fileContentMap, this.state.selectedFile, '')

    var extensionRegex = /\.[0-9a-z]+$/i
    const extension = this.state.selectedFile.match(extensionRegex)

    let highlightedLines = null
    if (this.state.selectedFile === 'webpack.config.js') {
      highlightedLines = this.props.highlightedWebpackConfigLines
    } else if (this.state.selectedFile === 'package.json') {
      highlightedLines = this.props.highlightedPackageJsonLines
    }

    return (
      <div className={styles.fileBrowser}>
        <FileList
          selectedFile={this.state.selectedFile}
          files={_.keys(fileContentMap)}
          onSelectFile={this.setSelectedFile}
        />
        <CodeBox
          extension={extension}
          code={content}
          highlightedLines={highlightedLines}
        />
      </div>
    )
  }
}

class FileBrowserContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      packageJson: '// fetching dependency versions...',
      packageJsonWithoutHighlightedFeature: null,
    }
    this.updatePackageJson = this.updatePackageJson.bind(this)
    //loop through promises
  }
  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(this.props.highlightFeature, prevProps.highlightFeature) ||
      !_.isEqual(this.props.features, prevProps.features)
    ) {
      this.updatePackageJson()
    }
  }
  componentDidMount() {
    this.updatePackageJson()
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
  getDiffAsLineNumberMemoized = memoizee(getDiffAsLineNumber)

  updatePackageJson() {
    const { features, highlightFeature } = this.props
    const newNpmConfig = getNpmDependencies(features)
    getPackageJson(
      getDefaultProjectName('empty-project', features),
      newNpmConfig.dependencies,
      newNpmConfig.devDependencies,
      this.getNodeVersionPromise,
      features
    ).then(packageJson => {
      this.setState({ packageJson: JSON.stringify(packageJson, null, 2) })
      if (!highlightFeature) {
        this.setState({ packageJsonWithoutHighlightedFeature: null })
        return
      }
      const featuresWithoutHighlighted = this.getAllFeaturesExceptHighlighted(
        features,
        highlightFeature
      )
      const npmConfigWithoutHighlighted = getNpmDependencies(
        featuresWithoutHighlighted
      )
      getPackageJson(
        getDefaultProjectName('empty-project', features),
        npmConfigWithoutHighlighted.dependencies,
        npmConfigWithoutHighlighted.devDependencies,
        this.getNodeVersionPromise,
        featuresWithoutHighlighted
      ).then(packageJsonWithoutHighlightedFeature => {
        this.setState({
          packageJsonWithoutHighlightedFeature: JSON.stringify(
            packageJsonWithoutHighlightedFeature,
            null,
            2
          ),
        })
      })
    })
  }
  prettifyJson(json) {
    // This is disabled for now.
    // must adjust width to editor width to enable it
    return json /*prettier.format(json, {
      parser: 'babylon',
      printWidth: 40, // TODO: dont auto use 40 widht
      plugins: { babylon: parserBabylon },
    })*/
  }
  getAllFeaturesExceptHighlighted = memoizee((features, highlightFeature) =>
    _.reject(features, f => f === highlightFeature)
  )
  getWebpackLineNumbersToHighlight = memoizee((features, highlightFeature) => {
    if (!_.includes(features, highlightFeature)) {
      return
    }
    const webpackConfigWithoutHighlighted = createWebpackConfig(
      this.getAllFeaturesExceptHighlighted(features, highlightFeature)
    )
    const webpackConfigCurrent = createWebpackConfig(features)
    return this.getDiffAsLineNumberMemoized(
      this.prettifyJson(webpackConfigWithoutHighlighted),
      this.prettifyJson(webpackConfigCurrent)
    )
  })
  getProjectFiles = memoizee((features, packageJson) => {
    const files = _.assign({}, projectGenerator(features, 'empty-project'), {
      'package.json': packageJson,
    })
    const filesPrettified = _.forEach(files, (f, k) => {
      if (k === 'webpack.config.js') {
        files['webpack.config.js'] = this.prettifyJson(f)
      }
    })

    return filesPrettified
  })
  render() {
    const { features, highlightFeature } = this.props

    return (
      <FileBrowser
        defaultSelection={'webpack.config.js'}
        fileContentMap={this.getProjectFiles(features, this.state.packageJson)}
        highlightedWebpackConfigLines={this.getWebpackLineNumbersToHighlight(
          features,
          highlightFeature
        )}
        highlightedPackageJsonLines={this.getDiffAsLineNumberMemoized(
          this.state.packageJsonWithoutHighlightedFeature,
          this.state.packageJson
        )}
      />
    )
  }
}

export default FileBrowserContainer
