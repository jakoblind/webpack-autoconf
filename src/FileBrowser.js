import React from 'react'
import _ from 'lodash'

import { getPackageJson, getDefaultProjectName } from './configurator'

import projectGenerator from './project-generator'
import styles from './styles.module.css'
import Prism from 'prismjs'
require('prismjs/themes/prism-tomorrow.css')

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

const CodeBox = ({ code }) => {
  const highlightedCode = () => {
    return {
      __html: Prism.highlight(code, Prism.languages.javascript, 'javascript'), // eslint-disable-line
    }
  }

  return (
    <pre className={styles.codeBox}>
      <code
        className={styles.languageCss}
        dangerouslySetInnerHTML={highlightedCode()}
      />
    </pre>
  )
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
    return (
      <div className={styles.fileBrowser}>
        <FileList
          selectedFile={this.state.selectedFile}
          files={_.keys(fileContentMap)}
          onSelectFile={this.setSelectedFile}
        />
        <CodeBox extension={extension} code={content} />
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
    if (this.props.newNpmConfig !== prevProps.newNpmConfig) {
      this.updatePackageJson()
    }
  }
  updatePackageJson() {
    this.setState({
      packageJson: '// fetching dependency versions...',
    })

    const getNodeVersionPromise = name => {
      return fetch(`https://unpkg.com/${name}/package.json`)
        .then(res => res.json())
        .then(r => {
          return '^' + r.version
        })
    }
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
  render() {
    const { features } = this.props

    const files = _.assign({}, projectGenerator(features, 'empty-project'), {
      'package.json': JSON.stringify(this.state.packageJson, null, 2),
    })

    return (
      <FileBrowser
        defaultSelection={'webpack.config.js'}
        fileContentMap={files}
      />
    )
  }
}

export default FileBrowserContainer
