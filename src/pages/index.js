import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'gatsby';
import jszip from 'jszip';
import Joyride from 'react-joyride';
import { saveAs } from 'file-saver';
import Modal from '../components/Modal';
import styles from '../styles.module.css';
import npmVersionPromise from '../fetch-npm-version';

import { CourseSignupForm } from '../components/SignupForms';

import {
  webpackConfig,
  parcelConfig,
} from '../configurator/configurator-config';

import {
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
} from '../configurator/configurator';

import FileBrowser from '../components/FileBrowser';

import Layout from '../components/layout';
import Features, {
  selectionRules as allSelectionRules,
} from '../components/configurator/Features';
import generateProject, {
  generateParcelProject,
} from '../configurator/project-generator';

import onboardingHelp from '../onboardingHelp';
import DocsViewer from '../components/DocsViewer';
import { trackPageView, gaSendEvent } from '../googleAnalytics';

const StepByStepArea = ({ features, newBabelConfig, isReact, isWebpack }) => {
  const newNpmConfig = getNpmDependencies(
    isWebpack ? webpackConfig : parcelConfig,
    features
  );

  const npmInstallCommand = _.isEmpty(newNpmConfig.dependencies)
    ? ''
    : `\nnpm install ${newNpmConfig.dependencies.join(' ')}`;
  const npmCommand = `mkdir myapp\ncd myapp\nnpm init -y\nnpm install --save-dev ${newNpmConfig.devDependencies.join(
    ' '
  )}${npmInstallCommand}`;
  const isTypescript = _.includes(features, 'Typescript');

  let babelStep = null;
  if (newBabelConfig) {
    babelStep = (
      <div>
        <li>
          Create <i>.babelrc</i> in the root and copy the contents of the
          generated file
        </li>
      </div>
    );
  } else if (isTypescript) {
    // currently, you cannt use both typescript and babel.
    // if typescript is selected you must have a tsconf
    babelStep = (
      <div>
        <li>
          Create <i>tsconfig.json</i> in the root and copy the contents of the
          generated file
        </li>
      </div>
    );
  }
  let webpackStep = null;
  if (isWebpack) {
    webpackStep = (
      <li>
        Create <i>webpack.config.js</i> in the root and copy the contents of the
        generated file
      </li>
    );
  }

  const srcFoldersStep = (
    <li>Create folders src and dist and create source code files</li>
  );

  return (
    <div className={styles.rightSection}>
      <div>
        <h3>How to create your project yourself</h3>
        <ol>
          <li>Create an NPM project and install dependencies</li>
          <textarea
            aria-label="npm commands to install dependencies"
            readOnly
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
    </div>
  );
};

StepByStepArea.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  newBabelConfig: PropTypes.string,
  isReact: PropTypes.bool.isRequired,
  isWebpack: PropTypes.bool.isRequired,
};

StepByStepArea.defaultProps = {
  newBabelConfig: null, // createBabelConfig function returns null if babel is not selected
};

function Tabs({ selected, setSelected }) {
  return (
    <div className={styles.tabsContainer} id="tabs">
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
          <div>webpack</div>
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
  );
}

Tabs.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

Modal.setAppElement('#___gatsby');

function DownloadButton({ url, onClick, filename }) {
  const [modalOpen, setModalOpen] = useState(false);
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <div>
      <button
        className={styles.btn}
        onClick={() => {
          onClick();
          setModalOpen(true);
        }}
        id="download"
      >
        <img
          alt="zip file"
          className={styles.icon}
          src={require('../../images/zip.svg')}
        />
        <span>Download</span>
      </button>
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
  );
}

DownloadButton.propTypes = {
  url: PropTypes.string,
  filename: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

DownloadButton.defaultProps = {
  url: '',
};

const selectionRules = {
  stopSelectFunctions: [
    allSelectionRules.stopSelectFunctions.stopIfNotBabelOrTypescriptForReact,
  ],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.enforceEitherReactOrVueOrSvelte,
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
    allSelectionRules.additionalSelectFunctions.addOrRemoveReactHotLoader,
    allSelectionRules.additionalSelectFunctions.addCssIfPostCSS,
    allSelectionRules.additionalSelectFunctions.removeEslintIfTypscript,
    allSelectionRules.additionalSelectFunctions
      .addHTMLWebpackPluginIfCodeSplitVendors,
  ],
};

const parcelSelectionRules = {
  stopSelectFunctions: [
    allSelectionRules.stopSelectFunctions.stopIfNotBabelOrTypescriptForReact,
  ],
  additionalSelectFunctions: [
    allSelectionRules.additionalSelectFunctions.enforceEitherReactOrVueOrSvelte,
    allSelectionRules.additionalSelectFunctions.addBabelIfReact,
  ],
};

const buildConfigConfig = {
  webpack: {
    featureConfig: webpackConfig,
    projectGeneratorFunction: generateProject,
    defaultFile: 'webpack.config.js',
    selectionRules,
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
    extraElements: [
      <br key={1} />,
      <Link key={2} to="/parcel-course">
        Free parcel course
      </Link>,
      <br key={3} />,
    ],
  },
};

const initialState = (selectedTab = 'webpack') => ({
  selectedTab,
  selectedFeatures: {},
});

function reducer(state, action) {
  switch (action.type) {
    case 'setSelectedTab':
      const newAllPossibleFeatures = _.keys(
        buildConfigConfig[action.selectedTab].featureConfig.features
      );

      const filteredFeatures = _.mapValues(
        state.selectedFeatures,
        (selected, feature) =>
          _.includes(newAllPossibleFeatures, feature) && selected
      );

      return {
        ...state,
        selectedTab: action.selectedTab,
        selectedFeatures: filteredFeatures,
      };
    case 'setSelectedFeatures':
      const setToSelected = !state.selectedFeatures[action.feature];
      // logFeatureClickToGa(feature, setToSelected)

      const selectedFeature = {
        ...state.selectedFeatures,
        [action.feature]: setToSelected,
      };

      if (
        _.some(
          _.map(
            buildConfigConfig[state.selectedTab].selectionRules
              .stopSelectFunctions,
            fn => fn(selectedFeature, action.feature, setToSelected)
          )
        )
      ) {
        return state;
      }

      const newSelected = _.reduce(
        buildConfigConfig[state.selectedTab].selectionRules
          .additionalSelectFunctions,
        (currentSelectionMap, fn) =>
          fn(currentSelectionMap, action.feature, setToSelected),
        selectedFeature
      );
      return { ...state, selectedFeatures: newSelected };

    default:
      throw new Error();
  }
}

function trackDownload(selectedTab, selectedFeatures) {
  gaSendEvent({
    eventCategory: 'Project download',
    eventAction: selectedTab,
    eventLabel: JSON.stringify(selectedFeatures),
  });
}

function trackHelpClick(eventAction) {
  gaSendEvent({
    eventCategory: 'Help clicked',
    eventAction,
  });
}

function Configurator(props) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState(props.selectedTab)
  );
  const [hoverFeature, setHoverFeature] = useState('');

  const {
    featureConfig,
    projectGeneratorFunction,
    defaultFile,
  } = buildConfigConfig[state.selectedTab];

  const selectedArray = _.chain(state.selectedFeatures)
    .map((v, k) => (v ? k : null))
    .reject(_.isNull)
    .value();

  function onMouseEnterFeature(feature) {
    setHoverFeature(feature);
  }
  function onMouseLeaveFeature() {
    setHoverFeature(null);
  }

  function downloadZip() {
    projectGeneratorFunction(
      selectedArray,
      'empty-project',
      npmVersionPromise
    ).then(res => {
      const zip = new jszip();
      _.forEach(res, (content, file) => {
        zip.file(file, content);
      });

      zip.generateAsync({ type: 'blob' }).then(function(blob) {
        saveAs(blob, 'empty-project.zip');
      });
    });
  }

  const newBabelConfig = createBabelConfig(selectedArray);

  const isReact = _.includes(selectedArray, 'React');
  const isTypescript = _.includes(selectedArray, 'Typescript');

  const projectname = getDefaultProjectName('empty-project', selectedArray);

  const showFeatures = _.clone(featureConfig.features);

  if (!isReact) {
    delete showFeatures['React hot loader'];
  }

  if (isTypescript) {
    delete showFeatures.ESLint;
  }

  return (
    <div>
      <Tabs
        selected={state.selectedTab}
        setSelected={selectedTab => {
          const newUrl = `/${selectedTab}`;
          trackPageView(newUrl);
          window.history.replaceState(null, null, newUrl);

          dispatch({ type: 'setSelectedTab', selectedTab });
        }}
      />

      <div className={styles.mainContainer}>
        <div className={styles.featuresContainer}>
          <Features
            features={showFeatures}
            selected={state.selectedFeatures}
            setSelected={feature =>
              dispatch({ type: 'setSelectedFeatures', feature })
            }
            onMouseEnter={onMouseEnterFeature}
            onMouseLeave={onMouseLeaveFeature}
            selectedBuildTool={state.selectedTab}
          />
          <div className={styles.desktopOnly}>
            <DownloadButton
              filename={`${projectname}.zip`}
              onClick={e => {
                downloadZip();
                trackDownload(state.selectedTab, selectedArray);
              }}
            />
          </div>
          {buildConfigConfig[state.selectedTab].extraElements}
          <br />
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
              onClick={e => {
                downloadZip();
                trackDownload(state.selectedTab, selectedArray);
              }}
            />
          </div>
        </div>
      </div>
      <DocsViewer
        hoverFeature={hoverFeature}
        selectedFeatures={selectedArray}
        buildTool={state.selectedTab}
      />
      <div className={styles.container} id="step-by-step-instructions">
        <StepByStepArea
          features={selectedArray}
          newBabelConfig={newBabelConfig}
          isReact={isReact}
          isWebpack={state.selectedTab === 'webpack'}
        />
      </div>
    </div>
  );
}

Configurator.propTypes = {
  selectedTab: PropTypes.string,
};

Configurator.defaultProps = {
  selectedTab: 'webpack',
};

export class App extends React.Component {
  joyrideCallback({ lifecycle, step: { target } }) {
    if (lifecycle === 'tooltip') {
      trackHelpClick(target);
    }
  }

  render() {
    const {
      pageContext: { selectedTab },
    } = this.props;

    return (
      <Layout>
        <Joyride
          steps={onboardingHelp}
          continuous
          callback={this.joyrideCallback}
        />
        <Configurator selectedTab={selectedTab} />
      </Layout>
    );
  }
}

App.propTypes = {
  pageContext: PropTypes.shape({
    selectedTab: PropTypes.string,
  }),
};

App.defaultProps = {
  pageContext: {
    selectedTab: 'webpack',
  },
};

export default App;
