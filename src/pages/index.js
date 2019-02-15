import React from 'react'
import _ from 'lodash'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import { features } from '../configurator/configurator-config'

import {
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
} from '../configurator/configurator'

import FileBrowser from '../components/FileBrowser'

import Layout from '../components/layout'
import Features from '../components/configurator/Features'
import generateProject from '../configurator/project-generator'

const logFeatureClickToGa = (feature, selected) => {
  //const eventAction = selected ? 'select' : 'deselect'
  /*window.gtag('event', eventAction, {
    event_category: 'features',
    event_label: feature,
  })*/
}

const Footer = () => (
  <div className={styles.footer}>
    <h3>What is this? </h3>
    <p>
      When using this tool, you get a webpack.config.js that is created just for{' '}
      <i>you</i>. It's a great starting point for further development. The
      webpack.config.js will create an optimized bundle based on{' '}
      <a href="http://blog.jakoblind.no/3-ways-to-reduce-webpack-bundle-size/">
        best practices
      </a>
      . Advanced optimizations such as code splitting is not (yet?) fully
      supported with this tool.
    </p>
    <h4>Found a bug or want a feature?</h4>
    <p>
      Contact me on <a href="https://twitter.com/karljakoblind">twitter</a> or
      file an issue or even better make a PR on the{' '}
      <a href="https://github.com/jakoblind/webpack-configurator">
        github repo
      </a>
      . Yes this is open source. <br />
      <br />
      <a
        className="github-button"
        href="https://github.com/jakoblind/webpack-autoconf"
        data-icon="octicon-star"
        data-show-count="true"
        aria-label="Star jakoblind/webpack-autoconf on GitHub"
      >
        Star
      </a>
    </p>
    <br />
  </div>
)

const StepByStepArea = ({
  features,
  newNpmConfig,
  newBabelConfig,
  isReact,
}) => {
  const npmInstallCommand = _.isEmpty(newNpmConfig.dependencies)
    ? ''
    : '\nnpm install ' + newNpmConfig.dependencies.join(' ')
  const npmCommand =
    'mkdir myapp\ncd myapp\nnpm init -y\nnpm install --save-dev ' +
    newNpmConfig.devDependencies.join(' ') +
    npmInstallCommand
  const isTypescript = _.includes(features, 'Typescript')

  let babelStep = null
  if (newBabelConfig) {
    babelStep = (
      <div>
        <li>
          Create <i>.babelrc</i> in the root and copy the contents of the
          generated file
        </li>
      </div>
    )
  } else if (isTypescript) {
    //currently, you cannt use both typescript and babel.
    // if typescript is selected you must have a tsconf
    babelStep = (
      <div>
        <li>
          Create <i>tsconfig.json</i> in the root and copy the contents of the
          generated file
        </li>
      </div>
    )
  }

  let srcFoldersStep = (
    <li>Create folders src and dist and create source code files</li>
  )

  return (
    <div className={styles.rightSection}>
      <h3>How to create your project yourself</h3>
      <ol>
        <li>Create an NPM project and install dependencies</li>
        <textarea readOnly={true} rows="6" cols="50" value={npmCommand} />

        <li>
          Create <i>webpack.config.js</i> in the root and copy the contents of
          the generated file
        </li>

        {babelStep}
        {srcFoldersStep}
      </ol>
      <Link to="/course">Need more detailed instructions?</Link>
    </div>
  )
}

class Configurator extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selected: {}, hoverFeature: null }
    this.setSelected = this.setSelected.bind(this)
    this.onMouseEnterFeature = this.onMouseEnterFeature.bind(this)
    this.onMouseLeaveFeature = this.onMouseLeaveFeature.bind(this)
  }
  setSelected(feature) {
    const setToSelected = !this.state.selected[feature]
    logFeatureClickToGa(feature, setToSelected)
    const selected = Object.assign({}, this.state.selected, {
      [feature]: setToSelected,
    })

    // only possible to select one of Vue or React. Needing both is an edge case
    // that is probably very rare. It adds much complexity to support both.
    if (feature === 'Vue' && setToSelected) {
      selected['React'] = !setToSelected
      selected['React hot loader'] = false
    }
    // if user tries to deselect babel, and react is set and typescript is not set, then don't allow it
    if (
      feature === 'Babel' &&
      !setToSelected &&
      this.state.selected['React'] &&
      !this.state.selected['Typescript']
    ) {
      return
    }
    if (
      feature === 'Typescript' &&
      !setToSelected &&
      this.state.selected['React'] &&
      !this.state.selected['Babel']
    ) {
      return
    }
    //
    if (feature === 'React') {
      if (setToSelected) {
        selected['Vue'] = !setToSelected
        // let's default react hot loader
        selected['React hot loader'] = true
        if (!this.state.selected['Typescript']) {
          selected['Babel'] = true
        }
      } else {
        // cant have React hot loader without React
        selected['React hot loader'] = false
      }
    }
    if (selected['Typescript'] && selected['React']) {
      selected['React hot loader'] = false
    }

    this.setState({ selected })
  }
  selectedArray() {
    return _.chain(this.state.selected)
      .map((v, k) => (v ? k : null))
      .reject(_.isNull)
      .value()
  }
  onMouseEnterFeature(feature) {
    this.setState({ hoverFeature: feature })
  }
  onMouseLeaveFeature() {
    this.setState({ hoverFeature: null })
  }
  render() {
    const newBabelConfig = createBabelConfig(this.selectedArray())
    const newNpmConfig = getNpmDependencies(this.selectedArray())

    const isReact = _.includes(this.selectedArray(), 'React')
    const isTypescript = _.includes(this.selectedArray(), 'Typescript')

    const projectname = getDefaultProjectName(
      'empty-project',
      this.selectedArray()
    )

    const showFeatures = _.clone(features)

    if (!isReact) {
      delete showFeatures['React hot loader']
    }
    if (isReact && isTypescript) {
      delete showFeatures['React hot loader']
    }
    return (
      <div>
        <div className={styles.topContainer}>
          <div className={styles.featuresContainer}>
            <h1>webpack config tool</h1>
            <h3>Select your features</h3>
            <Features
              features={showFeatures}
              selected={this.state.selected}
              setSelected={this.setSelected}
              onMouseEnter={this.onMouseEnterFeature}
              onMouseLeave={this.onMouseLeaveFeature}
            />
            <div className={styles.desktopOnly}>
              <a
                href={`https://s3-eu-west-1.amazonaws.com/jakoblind/zips/${projectname}.zip`}
              >
                <img
                  alt="zip-file"
                  className={styles.icon}
                  src={require('../../images/zip.svg')}
                />
                Get your project as a zip!
              </a>
            </div>
            <br />
            <Link to="/course">Free webpack course</Link>
            <br />
            <br />
            <a
              href="https://twitter.com/share?ref_src=twsrc%5Etfw"
              className="twitter-share-button"
              data-text="webpack config tool: create a webpack config in your browser"
              data-url="https://webpack.jakoblind.no/"
              data-via="karljakoblind"
              data-lang="en"
              data-show-count="false"
            >
              Tweet
            </a>
          </div>
          <div className={styles.codeContainer}>
            <FileBrowser
              projectGeneratorFunction={generateProject}
              featureConfig={features}
              features={this.selectedArray()}
              highlightFeature={this.state.hoverFeature}
            />
            <br />
            <div className={styles.smallScreensOnly}>
              <a
                href={`https://s3-eu-west-1.amazonaws.com/jakoblind/zips/${projectname}.zip`}
              >
                <img
                  alt="zip-file"
                  className={styles.icon}
                  src={require('../../images/zip.svg')}
                />
                Get your project as a zip!
              </a>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.container} />
          <StepByStepArea
            features={this.selectedArray()}
            newNpmConfig={newNpmConfig}
            newBabelConfig={newBabelConfig}
            isReact={isReact}
          />
        </div>
        <Footer />
      </div>
    )
  }
}

const App = () => (
  <Layout>
    <Configurator />
  </Layout>
)

export default App
