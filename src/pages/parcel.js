import React, { useState } from 'react'
import _ from 'lodash'
import { Link } from 'gatsby'
import styles from '../styles.module.css'
import Features, { withFeatureState } from '../components/configurator/Features'
import FileBrowser from '../components/FileBrowser'
import { parcelConfig } from '../configurator/configurator-config'
import { generateParcelProject } from '../configurator/project-generator'

import {
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
} from '../configurator/configurator'

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
    const isReact = _.includes(this.selectedArray(), 'React')
    const isTypescript = _.includes(this.selectedArray(), 'Typescript')

    const projectname = getDefaultProjectName(
      'empty-project',
      this.selectedArray()
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
            <h3>Select your features</h3>
            <Features
              features={showFeatures}
              selected={this.state.selected}
              setSelected={this.setSelected}
              onMouseEnter={this.onMouseEnterFeature}
              onMouseLeave={this.onMouseLeaveFeature}
            />
          </div>
          <div className={styles.codeContainer}>
            <FileBrowser
              projectGeneratorFunction={generateParcelProject}
              featureConfig={parcelConfig.features}
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
      </div>
    )
  }
}
const App = () => <Configurator />

export default App
