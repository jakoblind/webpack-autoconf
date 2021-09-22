import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Modal from '../Modal';
import styles from '../../styles.module.css';
import { docsMap } from '../DocsViewer';
import { gaSendEvent } from '../../googleAnalytics';

function trackHelpIconClick(eventAction) {
  gaSendEvent({
    eventCategory: 'Help Icon clicked',
    eventAction,
  });
}

// eslint-disable-next-line no-unused-vars
function FeedbackForm({ feature, children }) {
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSent, setIsSent] = useState(false);
  const submit = e => {
    e.preventDefault();
    fetch(`https://hooks.zapier.com/hooks/catch/1239764/oo73gyz/`, {
      method: 'POST',
      body: JSON.stringify({ email, comment, key: feature }),
    }).then(() => setIsSent(true));
  };
  const thankYouMessage = <p>Thank you for your input!</p>;
  const form = (
    <>
      {children}
      <form className={styles.feedbackForm}>
        <label htmlFor="comment">Your question or comment</label>
        <textarea
          name="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <br />
        <label htmlFor="email">Email (optional)</label> <br />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="will only be used to send you a reply"
          onChange={e => setEmail(e.target.value)}
        />{' '}
        <br />
        <button type="submit" onClick={submit}>
          Send it!
        </button>
        <br />
        <br />
      </form>
    </>
  );
  return <>{isSent ? thankYouMessage : form}</>;
}

FeedbackForm.propTypes = {
  feature: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

FeedbackForm.defaultProps = {
  children: [],
};

export function FeatureHelp({ featureName, selectedBuildTool }) {
  const [modalOpen, setModalOpen] = useState(false);
  const helpText = docsMap(selectedBuildTool)[featureName];
  if (!helpText) {
    return null;
  }
  return (
    <div>
      <button
        onClick={() => {
          trackHelpIconClick(featureName);
          setModalOpen(true);
        }}
        className={styles.helpCircle}
      >
        ?
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal"
        contentLabel="Help"
      >
        <h2 style={{ width: '90%', float: 'left' }}>Help for {featureName}</h2>
        <button
          style={{ borderRadius: '100px', float: 'left' }}
          onClick={() => setModalOpen(false)}
        >
          X
        </button>
        <br />
        <br />
        {helpText}
      </Modal>
    </div>
  );
}

FeatureHelp.propTypes = {
  featureName: PropTypes.string.isRequired,
  selectedBuildTool: PropTypes.string.isRequired,
};

const Feature = ({
  feature,
  isRadio,
  selected,
  setSelected,
  onMouseEnter,
  onMouseLeave,
  selectedBuildTool,
  featureName,
}) => (
  <>
    <label
      className={styles.featureContainer}
      onMouseEnter={() => onMouseEnter(feature)}
      onMouseLeave={() => onMouseLeave(feature)}
      onTouchStart={() => onMouseEnter(feature)}
      onTouchEnd={() => onMouseLeave(feature)}
      onTouchCancel={() => onMouseLeave(feature)}
    >
      {featureName}
      <input
        checked={selected || false}
        onChange={() => setSelected(feature)}
        type={isRadio ? 'radio' : 'checkbox'}
        name="main-library"
      />
      <span className={isRadio ? styles.radio : styles.checkmark} />{' '}
    </label>
    <FeatureHelp featureName={feature} selectedBuildTool={selectedBuildTool} />
  </>
);

Feature.propTypes = {
  feature: PropTypes.string.isRequired,
  isRadio: PropTypes.bool,
  selected: PropTypes.bool,
  setSelected: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  selectedBuildTool: PropTypes.string.isRequired,
  featureName: PropTypes.string.isRequired,
};

Feature.defaultProps = {
  isRadio: false,
  selected: false,
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function FeatureGroup({
  featureList,
  group,
  selected,
  setSelected,
  onMouseEnter,
  onMouseLeave,
  selectedBuildTool,
  features,
}) {
  const [expanded, setExpanded] = useState(group === 'Main library');
  const isRadio = group === 'Main library';
  const prevSelected = usePrevious(selected);
  useEffect(() => {
    const anyChanged = _.reduce(
      featureList,
      (result, { feature }) => {
        return (
          result ||
          selected[feature] !== (prevSelected && prevSelected[feature])
        );
      },
      false
    );
    if (anyChanged) {
      setExpanded(true);
    }
  }, [selected]);

  return (
    <div className={styles.featureGroup}>
      <div
        className={styles.featureGroupName}
        onClick={() => setExpanded(!expanded)}
      >
        {group !== 'undefined' ? (expanded ? '− ' : '+ ') + group : ''}
      </div>
      {expanded ? (
        <div className={styles.featureGroupContainer}>
          {_.map(featureList, ({ feature }) => (
            <Feature
              featureName={features[feature].name}
              feature={feature}
              isRadio={isRadio} // main library options should be type radio
              selected={selected[feature]}
              setSelected={setSelected}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              selectedBuildTool={selectedBuildTool}
              key={feature}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const packageJsonShape = PropTypes.shape({});

FeatureGroup.propTypes = PropTypes.shape({
  featureList: PropTypes.arrayOf(
    PropTypes.shape({
      feature: PropTypes.string.isRequired,
      group: PropTypes.string.isRequired,
      packageJson: packageJsonShape.isRequired,
      webpackImports: PropTypes.arrayOf(PropTypes.any).isRequired,
    }).isRequired
  ).isRequired,
  group: PropTypes.string.isRequired,
  selected: packageJsonShape.isRequired,
  selectedBuildTool: PropTypes.string.isRequired,
}).isRequired;

export default class Features extends React.Component {
  render() {
    const {
      features,
      selected,
      setSelected,
      onMouseEnter,
      onMouseLeave,
      selectedBuildTool,
    } = this.props;

    const groupedFeatures = _.chain(features)
      .mapValues((v, k, o) => ({ ...v, feature: k }))
      .groupBy('group')
      .value();

    return (
      <div className={styles.features} id="features">
        {_.map(groupedFeatures, (featureList, group) => (
          <FeatureGroup
            features={features}
            featureList={featureList}
            group={group}
            setSelected={setSelected}
            selected={selected}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            selectedBuildTool={selectedBuildTool}
            key={group}
          />
        ))}
      </div>
    );
  }
}

const feautureShape = PropTypes.shape({
  group: PropTypes.string.isRequired,
  packageJson: packageJsonShape.isRequired,
  webpackImports: PropTypes.arrayOf(PropTypes.any).isRequired,
});

Features.propTypes = PropTypes.shape({
  features: PropTypes.objectOf(feautureShape).isRequired,
  selected: packageJsonShape.isRequired,
  selectedBuildTool: PropTypes.string.isRequired,
}).isRequired;

/*
  only possible to select one of Vue or React or Svelte. Needing both is an edge case
  that is probably very rare. It adds much complexity to support both.
*/
function enforceMainLibrary(allFeatureStates, affectedFeature, setToSelected) {
  // Deselect React if user picks Vue
  if (affectedFeature === 'vue' && setToSelected) {
    return {
      ...allFeatureStates,
      react: !setToSelected,
      svelte: !setToSelected,
      'no-library': !setToSelected,
    };
    // deselect vue if user selects react
  } else if (affectedFeature === 'react' && setToSelected) {
    return {
      ...allFeatureStates,
      vue: !setToSelected,
      svelte: !setToSelected,
      'no-library': !setToSelected,
    };
  } else if (affectedFeature === 'svelte' && setToSelected) {
    return {
      ...allFeatureStates,
      vue: !setToSelected,
      react: !setToSelected,
      'no-library': !setToSelected,
    };
  } else if (affectedFeature === 'no-library' && setToSelected) {
    return {
      ...allFeatureStates,
      vue: !setToSelected,
      react: !setToSelected,
      svelte: !setToSelected,
    };
  }

  return allFeatureStates;
}

function addOrRemoveReactHotLoader(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  let setReactHotLoader;

  if (
    (affectedFeature === 'vue' || affectedFeature === 'svelte') &&
    setToSelected
  ) {
    setReactHotLoader = false;
  }

  if (affectedFeature === 'react') {
    if (setToSelected) {
      setReactHotLoader = true;
    } else {
      setReactHotLoader = false;
    }
  }
  if (setReactHotLoader === undefined) {
    return allFeatureStates;
  }
  return {
    ...allFeatureStates,
    'react-hot-loader': setReactHotLoader,
  };
}

function stopIfNotBabelOrTypescriptForReact(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  // if user tries to deselect babel, and react is set and typescript is not set, then don't allow it
  if (
    affectedFeature === 'babel' &&
    !setToSelected &&
    allFeatureStates.react &&
    !allFeatureStates.typescript
  ) {
    return true;
  }
  if (
    affectedFeature === 'typescript' &&
    !setToSelected &&
    allFeatureStates.react &&
    !allFeatureStates.babel
  ) {
    return true;
  }
  return false;
  //
}

function removeEslintIfTypscript(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  const toTypescript = affectedFeature === 'typescript' && setToSelected;

  return {
    ...allFeatureStates,
    eslint: toTypescript ? false : allFeatureStates.eslint,
  };
}

function removeMaterialIfNotReact(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  if (
    (affectedFeature === 'vue' ||
      affectedFeature === 'svelte' ||
      affectedFeature === 'no-library') &&
    setToSelected
  ) {
    return {
      ...allFeatureStates,
      'material-ui': false,
    };
  }
  return allFeatureStates;
}

function addPostCSSandCSSIfTailwindCSS(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  return {
    ...allFeatureStates,
    css:
      affectedFeature === 'tailwind-css' && setToSelected
        ? true
        : allFeatureStates.css,
    postcss:
      affectedFeature === 'tailwind-css' && setToSelected
        ? true
        : allFeatureStates.postcss,
  };
}

function addXIfY(x, y) {
  return function(allFeatureStates, affectedFeature, setToSelected) {
    return {
      ...allFeatureStates,
      [x]: affectedFeature === y && setToSelected ? true : allFeatureStates[x],
    };
  };
}

function addBabelIfReact(allFeatureStates, affectedFeature, setToSelected) {
  const forceBabel = allFeatureStates.react && !allFeatureStates.Typescript;

  return {
    ...allFeatureStates,
    babel: forceBabel || allFeatureStates.babel,
  };
}

// these are all possible selection rules.
// a selection rule is a rule that alters a users selection
// one example is that you must have React to pick React hot loader
// these are callback functions that are called with the following arguments:
// - allFeatureStates: an object with all features as key and whether they are selected as value
// - affectedFeature: the feature the user just clicked
// - setToSelected: true if the feature the user just clicked is clicked to be selected
export const selectionRules = {
  stopSelectFunctions: { stopIfNotBabelOrTypescriptForReact },
  additionalSelectFunctions: {
    enforceMainLibrary,
    addBabelIfReact,
    addOrRemoveReactHotLoader,
    addCssIfPostCSS: addXIfY(`css`, `postcss`),
    addCopyPluginIfCleanPlugin: addXIfY(
      'copywebpackplugin',
      'cleanwebpackplugin'
    ),
    removeEslintIfTypscript,
    addHTMLWebpackPluginIfCodeSplitVendors: addXIfY(
      'html-webpack-plugin',
      'code-split-vendors'
    ),
    addPostCSSandCSSIfTailwindCSS,
    removeMaterialIfNotReact,
    addCSSifBootstrap: addXIfY('css', 'bootstrap'),
  },
};
// eslint-disable-next-line
const logFeaturCelickToGa = (feature, selected) => {
  // const eventAction = selected ? 'select' : 'deselect'
  /* window.gtag('event', eventAction, {
    event_category: 'features',
    event_label: feature,
  }) */
};
