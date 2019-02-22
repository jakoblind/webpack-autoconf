import React, { useState } from 'react'
import _ from 'lodash'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import { webpackConfig, parcelConfig } from '../configurator/configurator-config'

import {
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
} from '../configurator/configurator'

import FileBrowser from '../components/FileBrowser'

import Layout from '../components/layout'
import Features, {
  withFeatureState,
  selectionRules as allSelectionRules,
} from '../components/configurator/Features'
import generateProject, {generateParcelProject} from '../configurator/project-generator'

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

function Tabs({selected, setSelected}) {
    return (
      <div className={styles.tabsContainer}>
        <nav className={styles.tabs}>
          <a
            onClick={() => setSelected('webpack')}
            href="#"
            style={{ width: '135px' }}
            className={
              selected === 'webpack' ? styles.selectedTab : null
            }
          >
            <img
              width="40"
              src={require(`../../images/webpack-logo${
                selected === 'webpack' ? '-color' : ''
              }.png`)}
            />
            <div>Webpack</div>
          </a>
          <a
            onClick={() => setSelected('parcel')}
            href="#"
            style={{ width: '105px' }}
            className={
              selected === 'parcel' ? styles.selectedTab : null
            }
          >
            <img
              width="37"
              src={require(`../../images/parcel-logo${
                selected === 'parcel' ? '-color' : ''
              }.png`)}
            />
            <div>Parcel</div>
          </a>
        </nav>
      </div>
    )
}

const Button = ({ url }) => (
  <a href={url} className={styles.btn}>
    <img
      alt="zip-file"
      className={styles.icon}
      src={require('../../images/zip.svg')}
    />
    <span>Download</span>
  </a>
)

class Configurator extends React.Component {
  render() {
    const newBabelConfig = createBabelConfig(this.props.selectedArray)
    const newNpmConfig = getNpmDependencies(
      webpackConfig,
      this.props.selectedArray
    )

    const isReact = _.includes(this.props.selectedArray, 'React')
    const isTypescript = _.includes(this.props.selectedArray, 'Typescript')

    const projectname = getDefaultProjectName(
      'empty-project',
      this.props.selectedArray
    )

      const featureConfig = this.props.selectedBuildTool === "webpack" ? webpackConfig : parcelConfig;
      const projectGeneratorFunction=this.props.selectedBuildTool === "webpack" ? generateProject:generateParcelProject;
    const showFeatures = _.clone(featureConfig.features)

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
            <Features
              features={showFeatures}
              selected={this.props.selected}
              setSelected={this.props.setSelected}
              onMouseEnter={this.props.onMouseEnterFeature}
              onMouseLeave={this.props.onMouseLeaveFeature}
            />
            <div className={styles.desktopOnly}>
              <Button
                url={`https://s3-eu-west-1.amazonaws.com/jakoblind/zips/${projectname}.zip`}
              />
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
              projectGeneratorFunction={projectGeneratorFunction}
              featureConfig={featureConfig}
              features={this.props.selectedArray}
              highlightFeature={this.props.hoverFeature}
            />
            <br />
            <div className={styles.smallScreensOnly}>
              <Button
                url={`https://s3-eu-west-1.amazonaws.com/jakoblind/zips/${projectname}.zip`}
              />
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.container} />
          <StepByStepArea
            features={this.props.selectedArray}
            newNpmConfig={newNpmConfig}
            newBabelConfig={newBabelConfig}
            isReact={isReact}
          />
        </div>
      </div>
    )
  }
}

const selectionRules = {
  stopSelectFunctions: [
    allSelectionRules.stopSelectFunctions.stopIfNotBabelOrTypescriptForReact,
  ],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.enforceEitherReactOrVue,
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
    allSelectionRules.additionalSelectFunctions.addOrRemoveReactHotLoader,
  ],
}

const parcelSelectionRules = {
  stopSelectFunctions: [],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
  ],
}

const WebpackConfiguratorWithState = withFeatureState(selectionRules, Configurator)
const ParcelConfiguratorWithState = withFeatureState(parcelSelectionRules, Configurator)

function App(){
    const [selected, setSelected] = useState("webpack")
  return (
  <Layout>
      <Tabs selected={selected} setSelected={setSelected}/>
      {selected === "webpack" ? <WebpackConfiguratorWithState selectedBuildTool={selected}/> : <ParcelConfiguratorWithState selectedBuildTool={selected}/>}
  </Layout>
)
}

export default App
