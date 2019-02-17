import React from 'react'
import _ from 'lodash'

import {
  getPackageJson,
  getDefaultProjectName,
} from '../configurator/configurator'

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
  const filesElements = _.map(files, ({ highlightedFile }, file) => (
    <li
      className={
        file === selectedFile
          ? styles.selected
          : highlightedFile
            ? styles.highlighted
            : null
      }
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
    const fileContent = _.get(fileContentMap, this.state.selectedFile, '')

    var extensionRegex = /\.[0-9a-z]+$/i
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
        //highlightedFile = true
        const lines = content.currentContent.split(/\r\n|\r|\n/).length
        highlightedLines = `1-${lines}`
      } else if (content.previousContent !== content.currentContent) {
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
  loadAllDependencyVersions(features) {
    const npmConfigAllFeatures = getNpmDependencies(features)
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
    this.loadAllDependencyVersions(_.keys(this.props.featureConfig))
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
        defaultSelection={'webpack.config.js'}
        files={files}
      />
    )
  }
}

export default FileBrowserContainer
