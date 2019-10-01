import jsStringify from 'javascript-stringify'
import _ from 'lodash'

import { baseWebpack, baseWebpackImports, packageJson } from '../templates/base'
import { webpackConfig } from './configurator-config'

const features = webpackConfig.features // TODO it should not be read from here

export function getDefaultProjectName(name, features) {
  return name + '-' + _.kebabCase(_.sortBy(features))
}

function stringifyReplacer(value, indent, stringify) {
  if (typeof value === 'string' && value.startsWith('CODE:')) {
    return value.replace(/"/g, '\\"').replace(/^CODE:/, '')
  }

  return stringify(value)
}

function createConfig(configItems, configType) {
  const isReact = _.includes(configItems, 'React')
  const isTypescript = _.includes(configItems, 'Typescript')
  const isHotReact = _.includes(configItems, 'React hot loader')

  let entryExtension = 'js'
  if (isTypescript) {
    if (isReact) {
      entryExtension = 'tsx'
    } else {
      entryExtension = 'ts'
    }
  }

  let entry = `./src/index.${entryExtension}`
  if (isTypescript && isHotReact) {
    entry = [
      'react-hot-loader/patch', // activate HMR for React
      'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
      'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
      `./src/index.${entryExtension}`,
    ]
  }
  const baseWebpackTsSupport = _.assignIn(baseWebpack, { entry })
  const base = configType === 'webpack' ? baseWebpackTsSupport : {}
  return jsStringify(
    _.reduce(
      configItems,
      (acc, currentValue) =>
        features[currentValue][configType](acc, configItems),
      base
    ),
    stringifyReplacer,
    2
  )
}

export function getNpmDependencies(featureConfig, configItems) {
  const dependencies = _.chain(configItems)
    .reduce(
      (acc, currentValue) =>
        _.concat(
          acc,
          featureConfig.features[currentValue]['dependencies'](configItems)
        ),
      _.get(featureConfig, 'base.dependencies', [])
    )
    .uniq()
    .value()

  const devDependencies = _.chain(configItems)
    .reduce(
      (acc, currentValue) =>
        _.concat(
          acc,
          featureConfig.features[currentValue]['devDependencies'](configItems)
        ),
      _.get(featureConfig, 'base.devDependencies', [])
    )
    .uniq()
    .value()

  return {
    dependencies,
    devDependencies,
  }
}

export function getWebpackImports(configItems) {
  return _.reduce(
    configItems,
    (acc, currentValue) =>
      _.concat(acc, features[currentValue]['webpackImports']),
    []
  )
}

export function createBabelConfig(configItems) {
  const config = createConfig(configItems, 'babel')
  return config === '{}' ? null : config
}

export function createWebpackConfig(configItems) {
  const imports = _.concat(baseWebpackImports, getWebpackImports(configItems))
  return `${imports.join('\n')}

const config = ${createConfig(configItems, 'webpack')}

module.exports = config;`
}

// some config items can alter the package json. for example the scripts section
function createPackageJsonConfig(featureConfig, configItems) {
  return _.reduce(
    configItems,
    (acc, currentValue) =>
      _.merge(acc, featureConfig.features[currentValue]['packageJson']),
    {}
  )
}
// some config items can alter the package json. for example the scripts section
export function createAdditionalFilesMap(featureConfig, configItems) {
  const filesFromFeatures = _.reduce(
    configItems,
    (acc, currentValue) =>
      _.assign(acc, featureConfig.features[currentValue]['files'](configItems)),
    {}
  )
  return _.assign(filesFromFeatures, featureConfig.base.files(configItems))
}

export function getPackageJson(
  featureConfig,
  name,
  getNodeVersionPromise,
  features
) {
  const {
    dependencies: dependenciesNames,
    devDependencies: devDependenciesNames,
  } = getNpmDependencies(featureConfig, features)

  const dependenciesVersionsPromises = _.map(
    dependenciesNames,
    getNodeVersionPromise
  )
  const devDependenciesVersionsPromises = _.map(
    devDependenciesNames,
    getNodeVersionPromise
  )
  let dependenciesVersions
  return Promise.all(dependenciesVersionsPromises)
    .then(response => {
      dependenciesVersions = response
      return Promise.all(devDependenciesVersionsPromises)
    })
    .then(devDependenciesVersions => {
      const dependencies = _.zipObject(dependenciesNames, dependenciesVersions)
      const devDependencies = _.zipObject(
        devDependenciesNames,
        devDependenciesVersions
      )

      const generatedPackageJson = Object.assign(
        {},
        { name },
        _.merge(
          {},
          packageJson,
          featureConfig.base.packageJson,
          createPackageJsonConfig(featureConfig, features)
        ),
        { dependencies },
        { devDependencies }
      )

      return generatedPackageJson
    })
}
