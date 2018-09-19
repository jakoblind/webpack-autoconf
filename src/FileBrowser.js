import React from 'react'
import _ from 'lodash'

import { getPackageJson, getDefaultProjectName } from './configurator'

import {
  reactIndexJs,
  reactIndexTsx,
  reactHotIndexJs,
  reactIndexHtml,
} from './../static/react/index'

import { emptyIndexJs } from './../static/empty/index'
import { readmeFile } from './templates'
import {
  indexTypescript,
  indexTypescriptHTML,
  tsconfig,
  tsconfigReact,
} from '../static/ts'
import {
  vueHelloWorldJs,
  vueHelloWorldTS,
  vueIndexAppVue,
  vueIndexHtml,
  vueIndexTs,
} from '../static/vue'

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
    const { features, newWebpackConfig, newBabelConfig } = this.props

    const isReact = _.includes(features, 'React')
    const isVue = _.includes(features, 'Vue')
    const isTypescript = _.includes(features, 'Typescript')
    const isHotReact = _.includes(this.props.features, 'React hot loader')

    const indexJsFileName = isTypescript
      ? isReact
        ? 'src/index.tsx'
        : 'src/index.ts'
      : 'src/index.js'

    const reactFileNames = ['dist/index.html', indexJsFileName]

    const VueFileNames = ['src/App.vue', 'src/Hello.vue']
    let sourceCodeFiles = indexJsFileName

    if (isVue) {
      sourceCodeFiles = VueFileNames
    } else if (isReact) {
      sourceCodeFiles = reactFileNames
    }

    const filesToShow = _.concat(
      ['webpack.config.js', 'package.json', 'README.md'],
      sourceCodeFiles,
      newBabelConfig && !isVue ? '.babelrc' : [],
      isTypescript ? ['tsconfig.json'] : []
    )

    let indexJsFile = emptyIndexJs
    let indexHTML = ''

    if (isTypescript) {
      indexJsFile = indexTypescript
      indexHTML = indexTypescriptHTML
    }

    if (isReact) {
      if (isHotReact) {
        indexJsFile = reactHotIndexJs
      } else {
        indexJsFile = reactIndexJs
      }
      indexHTML = reactIndexHtml
    }

    if (isVue) {
      indexJsFile = vueIndexTs
      indexHTML = vueIndexHtml
    }

    const completeFileContentMap = {
      'webpack.config.js': newWebpackConfig,
      'package.json': JSON.stringify(this.state.packageJson, null, 2),
      'dist/index.html': indexHTML,
      [`src/index.${isTypescript ? 'ts' : 'js'}`]: indexJsFile,
      'tsconfig.json': isReact ? tsconfigReact : tsconfig,
      'src/index.tsx': reactIndexTsx,
      '.babelrc': newBabelConfig,
      'src/App.vue': vueIndexAppVue,
      'src/Hello.vue': isTypescript ? vueHelloWorldTS : vueHelloWorldJs,
      'README.md': readmeFile('empty-project', isReact, isHotReact),
    }

    const fileContentMap = _.pickBy(completeFileContentMap, (value, fileName) =>
      _.includes(filesToShow, fileName)
    )

    return (
      <FileBrowser
        defaultSelection={'webpack.config.js'}
        fileContentMap={fileContentMap}
      />
    )
  }
}

export default FileBrowserContainer
