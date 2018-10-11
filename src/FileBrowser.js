import React from 'react'
import _ from 'lodash'

import { getPackageJson, getDefaultProjectName } from './configurator'

import projectGenerator from './project-generator'
import styles from './styles.module.css'
import './prism-line-highlight.css'
import Prism from 'prismjs'
import memoizee from 'memoizee'
import { createWebpackConfig } from './configurator'

// disable prettier for now.
// import prettier from 'prettier/standalone'
// const parserBabylon = require('prettier/parser-babylon')

const JsDiff = require('diff')

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
      props.code != this.props.code ||
      props.highlightedLines != this.props.highlightedLines
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

    // Only highlight webpack.config.js for now.
    const highlightedLines =
      this.state.selectedFile === 'webpack.config.js'
        ? this.props.highlightedWebpackConfigLines
        : null

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
      packageJson: '',
    }
    this.updatePackageJson = this.updatePackageJson.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.newNpmConfig, prevProps.newNpmConfig)) {
      this.updatePackageJson()
    }
  }
  updatePackageJson() {
    this.setState({
      packageJson: '// fetching dependency versions...',
    })

    const getNodeVersionPromise = memoizee(
      name => {
        return fetch(`https://unpkg.com/${name}/package.json`)
          .then(res => res.json())
          .then(r => {
            return '^' + r.version
          })
      },
      { promise: true }
    )
    const { newNpmConfig, features } = this.props
    getPackageJson(
      getDefaultProjectName('empty-project', features),
      newNpmConfig.dependencies,
      newNpmConfig.devDependencies,
      getNodeVersionPromise,
      features
    ).then(packageJson => this.setState({ packageJson }))
  }
  componentDidMount() {
    this.updatePackageJson()
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
  prettifyJsonMemoized = memoizee(this.prettifyJson)
  getLineNumbersToHighlight = memoizee((features, highlightFeature) => {
    if (!_.includes(features, highlightFeature)) {
      return
    }
    const webpackConfigWithoutHighlighted = createWebpackConfig(
      _.reject(features, f => f === highlightFeature)
    )
    const webpackConfigCurrent = createWebpackConfig(features)

    const diff = JsDiff.diffJson(
      this.prettifyJson(webpackConfigWithoutHighlighted),
      this.prettifyJson(webpackConfigCurrent)
    )

    let highlightedLines = ''
    let currentLineNumber = 0
    diff.forEach(part => {
      if (part.removed) {
        return
      }
      if (part.added) {
        if (highlightedLines !== '') {
          highlightedLines = highlightedLines + ','
        }

        highlightedLines =
          highlightedLines +
          (currentLineNumber + 1) +
          '-' +
          (part.count + currentLineNumber)
      }
      currentLineNumber = currentLineNumber + part.count
    })

    return highlightedLines
  })
  render() {
    const { features, highlightFeature } = this.props

    const files = _.assign({}, projectGenerator(features, 'empty-project'), {
      'package.json': JSON.stringify(this.state.packageJson, null, 2),
    })

    const filesPrettified = _.forEach(files, (f, k) => {
      if (k === 'webpack.config.js') {
        files['webpack.config.js'] = this.prettifyJsonMemoized(f)
      }
    })

    return (
      <FileBrowser
        defaultSelection={'webpack.config.js'}
        fileContentMap={filesPrettified}
        highlightedWebpackConfigLines={this.getLineNumbersToHighlight(
          features,
          highlightFeature
        )}
      />
    )
  }
}

export default FileBrowserContainer
