import React from 'react'
import _ from 'lodash'
import styles from '../../styles.module.css'

const Feature = ({
  feature,
  selected,
  setSelected,
  onMouseEnter,
  onMouseLeave,
}) => (
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
    <span className={styles.checkmark} />
  </label>
)

export default class Features extends React.Component {
  render() {
    const {
      features,
      selected,
      setSelected,
      onMouseEnter,
      onMouseLeave,
    } = this.props
    const groupedFeatures = _.chain(features)
      .mapValues((v, k, o) => Object.assign({}, v, { feature: k }))
      .groupBy('group')
      .value()

    return (
      <div className={styles.features}>
        {_.map(groupedFeatures, (featureList, group) => (
          <div className={styles.featureGroup} key={group}>
            <div className={styles.featureGroupName}>
              {group !== 'undefined' ? group : ''}
            </div>
            <div className={styles.featureGroupContainer}>
              {_.map(featureList, ({ feature }) => (
                <Feature
                  feature={feature}
                  selected={selected[feature]}
                  setSelected={setSelected}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  key={feature}
                />
              ))}
            </div>
          </div>
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
  if (allFeatureStates['Typescript'] && allFeatureStates['React']) {
    setReactHotLoader = false
  }
  if (setReactHotLoader === undefined) {
    return allFeatureStates
  }
  return {
    ...allFeatureStates,
    'React hot loader': setReactHotLoader,
  }

  return allFeatureStates
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
export const selectionRules = {
  stopSelectFunctions: { stopIfNotBabelOrTypescriptForReact },
  additionalSelectFunctions: {
    enforceEitherReactOrVue,
    addBabelIfReact,
    addOrRemoveReactHotLoader,
  },
}

export function withFeatureState(selectionRules, WrappedComponent) {
  return class extends React.Component {
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

      if (
        _.some(
          _.map(selectionRules.stopSelectFunctions, fn =>
            fn(selected, feature, setToSelected)
          )
        )
      ) {
        return
      }

      const newSelected = _.reduce(
        selectionRules.additionalSelectFunctions,
        (currentSelectionMap, fn) =>
          fn(currentSelectionMap, feature, setToSelected),
        selected
      )

      this.setState({
        selected: newSelected,
      })
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
      return (
        <WrappedComponent
          selected={this.state.selected}
          hoverFeature={this.state.hoverFeature}
          setSelected={this.setSelected}
          onMouseEnterFeature={this.onMouseEnterFeature}
          onMouseLeaveFeature={this.onMouseLeaveFeature}
          selectedArray={this.selectedArray()}
          {...this.props}
        />
      )
    }
  }
}

const logFeatureClickToGa = (feature, selected) => {
  //const eventAction = selected ? 'select' : 'deselect'
  /*window.gtag('event', eventAction, {
    event_category: 'features',
    event_label: feature,
  })*/
}
