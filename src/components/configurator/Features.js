import React, { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import styles from '../../styles.module.css'
import Modal from 'react-modal'
import { docsMap } from '../DocsViewer'
import { gaSendEvent } from '../../googleAnalytics'

function trackHelpIconClick(eventAction) {
  gaSendEvent({
    eventCategory: 'Help Icon clicked',
    eventAction,
  })
}

function FeedbackForm({ feature, children }) {
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [isSent, setIsSent] = useState(false)
  const submit = e => {
    e.preventDefault()
    fetch(`https://hooks.zapier.com/hooks/catch/1239764/oo73gyz/`, {
      method: 'POST',
      body: JSON.stringify({ email, comment, key: feature }),
    }).then(() => setIsSent(true))
  }
  const thankYouMessage = <p>Thank you for your input!</p>
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
  )
  return <>{isSent ? thankYouMessage : form}</>
}

function FeatureHelp({ featureName, selectedBuildTool }) {
  const [modalOpen, setModalOpen] = useState(false)
  const helpText = docsMap(selectedBuildTool)[featureName]
  if (!helpText) {
    return null
  }
  return (
    <>
      <button
        onClick={() => {
          trackHelpIconClick(featureName)
          setModalOpen(true)
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
    </>
  )
}
const Feature = ({
  feature,
  selected,
  setSelected,
  onMouseEnter,
  onMouseLeave,
  selectedBuildTool,
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
      {feature}
      <input
        checked={selected || false}
        onChange={() => setSelected(feature)}
        type="checkbox"
      />
      <span className={styles.checkmark} />{' '}
    </label>
    <FeatureHelp featureName={feature} selectedBuildTool={selectedBuildTool} />
  </>
)
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function FeatureGroup({
  featureList,
  group,
  selected,
  setSelected,
  onMouseEnter,
  onMouseLeave,
  selectedBuildTool,
}) {
  const [expanded, setExpanded] = useState(
    group === 'Main library' ? true : false
  )
  const prevSelected = usePrevious(selected)
  useEffect(() => {
    const anyChanged = _.reduce(
      featureList,
      (result, { feature }) => {
        return (
          result ||
          selected[feature] !== (prevSelected && prevSelected[feature])
        )
      },
      false
    )
    if (anyChanged) {
      setExpanded(true)
    }
  }, [selected])

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
              feature={feature}
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
  )
}

export default class Features extends React.Component {
  render() {
    const {
      features,
      selected,
      setSelected,
      onMouseEnter,
      onMouseLeave,
      selectedBuildTool,
    } = this.props
    const groupedFeatures = _.chain(features)
      .mapValues((v, k, o) => Object.assign({}, v, { feature: k }))
      .groupBy('group')
      .value()

    return (
      <div className={styles.features} id="features">
        {_.map(groupedFeatures, (featureList, group) => (
          <FeatureGroup
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
    )
  }
}

/*
  only possible to select one of Vue or React. Needing both is an edge case
  that is probably very rare. It adds much complexity to support both.
*/
function enforceEitherReactOrVue(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  // Deselect React if user picks Vue
  if (affectedFeature === 'Vue' && setToSelected) {
    return {
      ...allFeatureStates,
      React: !setToSelected,
    }
    // deselect vue if user selects react
  } else if (affectedFeature === 'React') {
    if (setToSelected) {
      return {
        ...allFeatureStates,
        Vue: !setToSelected,
      }
    }
  }

  return allFeatureStates
}

function addOrRemoveReactHotLoader(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  let setReactHotLoader

  if (affectedFeature === 'Vue' && setToSelected) {
    setReactHotLoader = false
  }

  if (affectedFeature === 'React') {
    if (setToSelected) {
      setReactHotLoader = true
    } else {
      setReactHotLoader = false
    }
  }
  if (setReactHotLoader === undefined) {
    return allFeatureStates
  }
  return {
    ...allFeatureStates,
    'React hot loader': setReactHotLoader,
  }
}

function stopIfNotBabelOrTypescriptForReact(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  // if user tries to deselect babel, and react is set and typescript is not set, then don't allow it
  if (
    affectedFeature === 'Babel' &&
    !setToSelected &&
    allFeatureStates['React'] &&
    !allFeatureStates['Typescript']
  ) {
    return true
  }
  if (
    affectedFeature === 'Typescript' &&
    !setToSelected &&
    allFeatureStates['React'] &&
    !allFeatureStates['Babel']
  ) {
    return true
  }
  return false
  //
}

function removeEslintIfTypscript(
  allFeatureStates,
  affectedFeature,
  setToSelected
) {
  const toTypescript = affectedFeature === 'Typescript' && setToSelected

  return {
    ...allFeatureStates,
    ESLint: toTypescript ? false : allFeatureStates['ESLint'],
  }
}

function addCssIfPostCSS(allFeatureStates, affectedFeature, setToSelected) {
  return {
    ...allFeatureStates,
    CSS:
      affectedFeature === 'PostCSS' && setToSelected
        ? true
        : allFeatureStates['CSS'],
  }
}

function addBabelIfReact(allFeatureStates, affectedFeature, setToSelected) {
  const forceBabel =
    allFeatureStates['React'] && !allFeatureStates['Typescript']

  return {
    ...allFeatureStates,
    Babel: forceBabel || allFeatureStates['Babel'],
  }
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
    enforceEitherReactOrVue,
    addBabelIfReact,
    addOrRemoveReactHotLoader,
    addCssIfPostCSS,
    removeEslintIfTypscript,
  },
}
// eslint-disable-next-line
const logFeaturCelickToGa = (feature, selected) => {
  //const eventAction = selected ? 'select' : 'deselect'
  /*window.gtag('event', eventAction, {
    event_category: 'features',
    event_label: feature,
  })*/
}
