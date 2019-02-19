import React, { useState } from 'react'
import _ from 'lodash'
import { Link } from 'gatsby'
import styles from '../styles.module.css'
import Features, {
  withFeatureState,
  selectionRules as allSelectionRules,
} from '../components/configurator/Features'
import FileBrowser from '../components/FileBrowser'
import { parcelConfig } from '../configurator/configurator-config'
import { generateParcelProject } from '../configurator/project-generator'

import {
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
} from '../configurator/configurator'

class Configurator extends React.Component {
  render() {
    const isReact = _.includes(this.props.selectedArray, 'React')
    const isTypescript = _.includes(this.props.selectedArray, 'Typescript')

    const projectname = getDefaultProjectName(
      'empty-project',
      this.props.selectedArray
    )

    const showFeatures = _.clone(parcelConfig.features)

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
            <Features
              features={showFeatures}
              selected={this.props.selected}
              setSelected={this.props.setSelected}
              onMouseEnter={this.props.onMouseEnterFeature}
              onMouseLeave={this.props.onMouseLeaveFeature}
            />
          </div>
          <div className={styles.codeContainer}>
            <FileBrowser
              defaultFile="src/index.js"
              projectGeneratorFunction={generateParcelProject}
              featureConfig={parcelConfig.features}
              features={this.props.selectedArray}
              highlightFeature={this.props.hoverFeature}
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
      </div>
    )
  }
}
const selectionRules = {
  stopSelectFunctions: [],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
  ],
}

const ConfiguratorWithState = withFeatureState(selectionRules, Configurator)
const App = () => <ConfiguratorWithState />

export default App
