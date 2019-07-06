import React, { useState, useReducer, useEffect } from 'react'
import _ from 'lodash'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import Modal from 'react-modal'
import { CourseSignupForm } from '../components/SignupForms'
import { TwitterShareButton, TwitterIcon } from 'react-share'

import {
  webpackConfig,
  parcelConfig,
} from '../configurator/configurator-config'

import {
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
} from '../configurator/configurator'

import FileBrowser from '../components/FileBrowser'

import Layout from '../components/layout'
import Features, {
  selectionRules as allSelectionRules,
} from '../components/configurator/Features'
import generateProject, {
  generateParcelProject,
} from '../configurator/project-generator'

const StepByStepArea = ({ features, newBabelConfig, isReact, isWebpack }) => {
  const newNpmConfig = getNpmDependencies(
    isWebpack ? webpackConfig : parcelConfig,
    features
  )

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
  let webpackStep = null
  if (isWebpack) {
    webpackStep = (
      <li>
        Create <i>webpack.config.js</i> in the root and copy the contents of the
        generated file
      </li>
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
        <textarea
          aria-label="npm commands to install dependencies"
          readOnly={true}
          rows="6"
          cols="50"
          value={npmCommand}
        />
        {webpackStep}

        {babelStep}
        {srcFoldersStep}
      </ol>
      <Link to="/webpack-course">Need more detailed instructions?</Link>
    </div>
  )
}

function Tabs({ selected, setSelected }) {
  return (
    <div className={styles.tabsContainer}>
      <nav className={styles.tabs}>
        <button
          onClick={() => setSelected('webpack')}
          className={[
            selected === 'webpack' ? styles.selectedTab : null,
            styles.webpackTab,
          ].join(' ')}
        >
          <img
            alt="webpack logo"
            src={require(`../../images/webpack-logo${
              selected === 'webpack' ? '-color' : ''
            }.png`)}
          />
          <div>Webpack</div>
        </button>
        <button
          onClick={() => setSelected('parcel')}
          className={[
            selected === 'parcel' ? styles.selectedTab : null,
            styles.parcelTab,
          ].join(' ')}
        >
          <img
            alt="parcel logo"
            src={require(`../../images/parcel-logo${
              selected === 'parcel' ? '-color' : ''
            }.png`)}
          />
          <div>Parcel</div>
        </button>
      </nav>
    </div>
  )
}

Modal.setAppElement('#___gatsby')

function DownloadButton({ url, onClick, filename }) {
  const [modalOpen, setModalOpen] = useState(false)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }

  return (
    <div>
      <a
        href={url}
        className={styles.btn}
        onClick={() => {
          onClick()
          setModalOpen(true)
        }}
      >
        <img
          alt="zip file"
          alt="zip-file"
          className={styles.icon}
          src={require('../../images/zip.svg')}
        />
        <span>Download</span>
      </a>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 style={{ width: '90%', float: 'left' }}>Downloading...</h2>
        <button
          style={{ borderRadius: '100px', float: 'left' }}
          onClick={() => setModalOpen(false)}
        >
          X
        </button>
        <br />
        <br />
        <p>Enjoy your newly created webpack project!</p>

        <h3>Learn webpack with my free email course</h3>
        <div>
          <p>You get 5 emails in 5 days.</p>
          <ul>
            <li>Lesson 1: What does webpack do? (an overview)</li>
            <li>Lesson 2: Create your first webpack project</li>
            <li>Lesson 3: The webpack.config.js and Babel</li>
            <li>Lesson 4: Create a React app with webpack</li>
            <li>Lesson 5: Styling with webpack</li>
          </ul>
        </div>
        <p>Level up your frontend skills and create awesome apps</p>
        <CourseSignupForm tags={917914} />
      </Modal>
    </div>
  )
}

const selectionRules = {
  stopSelectFunctions: [
    allSelectionRules.stopSelectFunctions.stopIfNotBabelOrTypescriptForReact,
  ],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.enforceEitherReactOrVue,
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
    allSelectionRules.additionalSelectFunctions.addOrRemoveReactHotLoader,
    allSelectionRules.additionalSelectFunctions.addCssIfPostCSS,
  ],
}

const parcelSelectionRules = {
  stopSelectFunctions: [
    allSelectionRules.stopSelectFunctions.stopIfNotBabelOrTypescriptForReact,
  ],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.enforceEitherReactOrVue,
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
  ],
}

const buildConfigConfig = {
  webpack: {
    featureConfig: webpackConfig,
    projectGeneratorFunction: generateProject,
    defaultFile: 'webpack.config.js',
    selectionRules,
    downloadUrlBase:
      'https://s3-eu-west-1.amazonaws.com/jakoblind/zips-webpack/',
    extraElements: [
      <br key={1} />,
      <Link key={2} to="/webpack-course">
        Free webpack course
      </Link>,
      <br key={3} />,
    ],
  },
  parcel: {
    featureConfig: parcelConfig,
    projectGeneratorFunction: generateParcelProject,
    defaultFile: 'package.json',
    selectionRules: parcelSelectionRules,
    downloadUrlBase:
      'https://s3-eu-west-1.amazonaws.com/jakoblind/zips-parcel/',
    extraElements: [
      <br key={1} />,
      <Link key={2} to="/parcel-course">
        Free parcel course
      </Link>,
      <br key={3} />,
    ],
  },
}

const initialState = (selectedTab = 'webpack') => ({
  selectedTab,
  selectedFeatures: {},
})

function reducer(state, action) {
  switch (action.type) {
    case 'setSelectedTab':
      const newAllPossibleFeatures = _.keys(
        buildConfigConfig[action.selectedTab].featureConfig.features
      )
      const selectedFeatures = _.chain(state.selectedFeatures)
        .map((selected, feature) => (selected ? feature : null))
        .reject(_.isNull)
        .value()

      const filteredFeatures = _.mapValues(
        state.selectedFeatures,
        (selected, feature) =>
          _.includes(newAllPossibleFeatures, feature) && selected
      )

      return {
        ...state,
        selectedTab: action.selectedTab,
        selectedFeatures: filteredFeatures,
      }
    case 'setSelectedFeatures':
      const setToSelected = !state.selectedFeatures[action.feature]
      //logFeatureClickToGa(feature, setToSelected)

      const selectedFature = Object.assign({}, state.selectedFeatures, {
        [action.feature]: setToSelected,
      })

      if (
        _.some(
          _.map(
            buildConfigConfig[state.selectedTab].selectionRules
              .stopSelectFunctions,
            fn => fn(selectedFature, action.feature, setToSelected)
          )
        )
      ) {
        return state
      }

      const newSelected = _.reduce(
        buildConfigConfig[state.selectedTab].selectionRules
          .additionalSelectFunctions,
        (currentSelectionMap, fn) =>
          fn(currentSelectionMap, action.feature, setToSelected),
        selectedFature
      )
      return { ...state, selectedFeatures: newSelected }

    default:
      throw new Error()
  }
}

function trackPageView(newUrl) {
  if (!window.ga) {
    return
  }
  window.ga('set', 'page', newUrl)
  window.ga('send', 'pageview')
}

function gaSendEvent({ eventCategory, eventAction, eventLabel }) {
  if (!window.ga) {
    console.log(
      'Ga debug: ',
      'send',
      'event',
      eventCategory,
      eventAction,
      eventLabel
    )
    return
  }
  window.ga('send', 'event', eventCategory, eventAction, eventLabel)
}

function trackDownload(selectedTab, selectedFeatures) {
  gaSendEvent({
    eventCategory: 'Project download',
    eventAction: selectedTab,
    eventLabel: JSON.stringify(selectedFeatures),
  })
}

function Configurator(props) {
  const [state, dispatch] = useReducer(reducer, initialState(props.selectedTab))
  const [hoverFeature, setHoverFeature] = useState({})

  function onMouseEnterFeature(feature) {
    setHoverFeature(feature)
  }
  function onMouseLeaveFeature() {
    setHoverFeature(null)
  }

  const selectedArray = _.chain(state.selectedFeatures)
    .map((v, k) => (v ? k : null))
    .reject(_.isNull)
    .value()

  const newBabelConfig = createBabelConfig(selectedArray)

  const isReact = _.includes(selectedArray, 'React')
  const isTypescript = _.includes(selectedArray, 'Typescript')

  const projectname = getDefaultProjectName('empty-project', selectedArray)

  const {
    featureConfig,
    projectGeneratorFunction,
    defaultFile,
  } = buildConfigConfig[state.selectedTab]
  const showFeatures = _.clone(featureConfig.features)

  if (!isReact) {
    delete showFeatures['React hot loader']
  }
  if (isReact && isTypescript) {
    delete showFeatures['React hot loader']
  }

  return (
    <div>
      <Tabs
        selected={state.selectedTab}
        setSelected={selectedTab => {
          const newUrl = `/${selectedTab}`
          trackPageView(newUrl)
          window.history.replaceState(null, null, newUrl)

          dispatch({ type: 'setSelectedTab', selectedTab })
        }}
      />

      <div className={styles.topContainer}>
        <div className={styles.marginsContainer}>
          <div className={styles.featuresContainer}>
            <Features
              features={showFeatures}
              selected={state.selectedFeatures}
              setSelected={feature =>
                dispatch({ type: 'setSelectedFeatures', feature })
              }
              onMouseEnter={onMouseEnterFeature}
              onMouseLeave={onMouseLeaveFeature}
            />
            <div className={styles.desktopOnly}>
              <DownloadButton
                filename={`${projectname}.zip`}
                onClick={e => trackDownload(state.selectedTab, selectedArray)}
                url={`${
                  buildConfigConfig[state.selectedTab].downloadUrlBase
                }${projectname}.zip`}
              />
            </div>
            {buildConfigConfig[state.selectedTab].extraElements}
            <br />
            <TwitterShareButton
              url={'https://createapp.dev/'}
              via="karljakoblind"
              title="Create a webpack or a parcel project in your browser"
            >
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
          </div>
          <div className={styles.codeContainer}>
            <FileBrowser
              projectGeneratorFunction={projectGeneratorFunction}
              featureConfig={featureConfig}
              features={selectedArray}
              highlightFeature={hoverFeature}
              defaultFile={defaultFile}
            />
            <br />
            <div className={styles.smallScreensOnly}>
              <DownloadButton
                filename={`${projectname}.zip`}
                onClick={e => trackDownload(state.selectedTab, selectedArray)}
                url={`${
                  buildConfigConfig[state.selectedTab].downloadUrlBase
                }${projectname}.zip`}
              />
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.container} />
          <StepByStepArea
            features={selectedArray}
            newBabelConfig={newBabelConfig}
            isReact={isReact}
            isWebpack={state.selectedTab === 'webpack'}
          />
        </div>
      </div>
    </div>
  )
}

function App(props) {
  const {
    pageContext: { selectedTab },
  } = props
  return (
    <Layout>
      <Configurator selectedTab={selectedTab} />
    </Layout>
  )
}

export default App
