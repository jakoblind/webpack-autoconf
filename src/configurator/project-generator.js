import _ from 'lodash'

import { readmeFile, readmeFileParcel } from '../templates/base'

import {
  createWebpackConfig,
  createBabelConfig,
  getDefaultProjectName,
  getNpmDependencies,
  getPackageJson,
  createAdditionalFilesMap,
} from './configurator'
import { emptyIndexJs } from '../templates/empty/index'
import { indexHtml } from '../templates/base'

import { parcelConfig, webpackConfig } from './configurator-config'

/*
  this function will call an external API to get version for node
  dependencies. therefore its a good idea to memoize it.
  if getNodeVersionPromise is null, no external api calls is made
  and the data is returned instead of in a promise

*/
const generateProject = (features, name, getNodeVersionPromise) => {
  const isBabel = _.includes(features, 'Babel')
  const isReact = _.includes(features, 'React')
  const isVue = _.includes(features, 'Vue')
  const isTypescript = _.includes(features, 'Typescript')
  const isHotReact = _.includes(features, 'React hot loader')
  const additionalFilesMap = createAdditionalFilesMap(webpackConfig, features)
  const newWebpackConfig = createWebpackConfig(features)
  const newNpmConfig = getNpmDependencies(webpackConfig, features)
  const newBabelConfig = createBabelConfig(features)
  const projectName = name || getDefaultProjectName('empty-project', features)

  const maybeConfigBabel =
    newBabelConfig && (isReact || isBabel)
      ? { '.babelrc': newBabelConfig }
      : null

  const maybeSourceCodeEmpty =
    !isTypescript && !isReact && !isVue
      ? { 'src/index.js': emptyIndexJs(), 'dist/index.html': indexHtml() }
      : null

  const fileMap = _.assign(
    {},
    {
      'webpack.config.js': newWebpackConfig,
      'README.md': readmeFile(projectName, isReact, isHotReact),
      'package.json': 'empty package.json',
    },
    additionalFilesMap,
    maybeConfigBabel,
    maybeSourceCodeEmpty
  )

  if (getNodeVersionPromise) {
    return getPackageJson(
      webpackConfig,
      projectName,
      getNodeVersionPromise,
      features
    ).then(packageJson => {
      fileMap['package.json'] = JSON.stringify(packageJson, null, 2)
      return fileMap
    })
  } else {
    return fileMap
  }
}

export function generateParcelProject(features, name, getNodeVersionPromise) {
  const isBabel = _.includes(features, 'Babel')
  const isReact = _.includes(features, 'React')
  const newBabelConfig = createBabelConfig(features)
  const additionalFilesMap = createAdditionalFilesMap(parcelConfig, features)
  const projectName = name || getDefaultProjectName('empty-project', features)
  const maybeConfigBabel =
    newBabelConfig && (isReact || isBabel)
      ? { '.babelrc': newBabelConfig }
      : null
  const maybeSourceCodeEmpty = !isReact
    ? {
        'src/index.js': emptyIndexJs(),
        'src/index.html': indexHtml(),
      }
    : null

  const fileMap = _.assign(
    {},
    {
      'README.md': readmeFileParcel(projectName, isReact, false),
    },
    maybeConfigBabel,
    additionalFilesMap,
    maybeSourceCodeEmpty
  )

  // TODO there is some duplicated code here. sorry
  if (getNodeVersionPromise) {
    return getPackageJson(
      parcelConfig,
      projectName,
      getNodeVersionPromise,
      features
    ).then(packageJson => {
      fileMap['package.json'] = JSON.stringify(packageJson, null, 2)
      return fileMap
    })
  } else {
    return fileMap
  }
}

export default generateProject
