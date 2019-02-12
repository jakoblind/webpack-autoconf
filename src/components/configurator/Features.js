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
