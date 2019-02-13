import jsStringify from 'javascript-stringify'
import _ from 'lodash'

import { baseWebpack, baseWebpackImports, packageJson } from '../templates/base'
import { features } from './configurator-config'

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

  let entryExtension = 'js'
  if (isTypescript) {
    if (isReact) {
      entryExtension = 'tsx'
    } else {
      entryExtension = 'ts'
    }
  }

  const entry = `./src/index.${entryExtension}`
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

export function getNpmDependencies(configItems) {
  const dependencies = _.chain(configItems)
    .reduce(
      (acc, currentValue) =>
        _.concat(acc, features[currentValue]['dependencies'](configItems)),
      []
    )
    .uniq()
    .value()

  const devDependencies = _.chain(configItems)
    .reduce(
      (acc, currentValue) =>
        _.concat(acc, features[currentValue]['devDependencies'](configItems)),
      ['webpack', 'webpack-cli']
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

export function getPackageJson(
  name,
  dependenciesNames,
  devDependenciesNames,
  getNodeVersionPromise,
  features
) {
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
        packageJson,
        { dependencies },
        { devDependencies }
      )

      const isHotReact = _.includes(features, 'React hot loader')

      if (isHotReact) {
        generatedPackageJson.scripts = Object.assign({}, packageJson.scripts, {
          start: 'webpack-dev-server --hot --mode development',
        })
      }

      return generatedPackageJson
    })
}
