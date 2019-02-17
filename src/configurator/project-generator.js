import _ from 'lodash'

import { readmeFile } from '../templates/base'

import {
  createWebpackConfig,
  createBabelConfig,
  getDefaultProjectName,
  getNpmDependencies,
  getPackageJson,
} from './configurator'
import {
  vueHelloWorldJs,
  vueHelloWorldTS,
  vueIndexAppVue,
  vueIndexHtml,
  vueIndexTs,
  vueShimType,
} from '../templates/vue'

import {
  reactIndexJs,
  reactIndexTsx,
  reactHotIndexJs,
  reactIndexHtml,
} from '../templates/react/index'
import { emptyIndexJs } from '../templates/empty/index'

import { indexTypescriptHTML, tsconfig, tsconfigReact } from '../templates/ts'

function maybeSourceCodeVue(isVue, isTypescript) {
  if (isVue) {
    const indexFilename = isTypescript ? 'src/index.ts' : 'src/index.js'
    const vueFilesCommon = {
      'src/App.vue': vueIndexAppVue,
      'src/Hello.vue': isTypescript ? vueHelloWorldTS : vueHelloWorldJs,
      'dist/index.html': vueIndexHtml,
      [indexFilename]: vueIndexTs,
    }

    return vueFilesCommon
  }
  return null
}

function maybeSourceCodeReact(isReact, isHotReact, isTypescript) {
  if (isReact) {
    if (isTypescript) {
      return {
        'src/index.tsx': reactIndexTsx,
        'dist/index.html': reactIndexHtml,
      }
    } else {
      return {
        'src/index.js': isHotReact ? reactHotIndexJs : reactIndexJs,
        'dist/index.html': reactIndexHtml,
      }
    }
  }
}

function maybeSourceCodeTypescriptOnly(isTypescript, isReact, isVue) {
  if (isTypescript && !isReact && !isVue) {
    return {
      'dist/index.html': indexTypescriptHTML,
      'src/index.ts': emptyIndexJs,
    }
  }
}

/*
  this function will call an external API to get version for node
  dependencies. therefore its a good idea to memoize it.
  if getNodeVersionPromise is null, no external api calls is made
  and the data is returned instead of in a promise

*/
function generateProject(features, name, getNodeVersionPromise) {
  const isBabel = _.includes(features, 'Babel')
  const isReact = _.includes(features, 'React')
  const isVue = _.includes(features, 'Vue')
  const isTypescript = _.includes(features, 'Typescript')
  const isHotReact = _.includes(features, 'React hot loader')

  const newWebpackConfig = createWebpackConfig(features)
  const newNpmConfig = getNpmDependencies(features)
  const newBabelConfig = createBabelConfig(features)
  const projectName = name || getDefaultProjectName('empty-project', features)

  const maybeConfigVue =
    isVue && isTypescript ? { 'vue-shim.d.ts': vueShimType } : null

  const maybeConfigBabel =
    newBabelConfig && (isReact || isBabel)
      ? { '.babelrc': newBabelConfig }
      : null

  const maybeConfigTypescript = isTypescript
    ? isReact
      ? { 'tsconfig.json': tsconfigReact }
      : { 'tsconfig.json': tsconfig }
    : null

  const maybeSourceCodeEmpty =
    !isTypescript && !isReact && !isVue
      ? { 'src/index.js': emptyIndexJs }
      : null

  const fileMap = _.assign(
    {},
    {
      'webpack.config.js': newWebpackConfig,
      'README.md': readmeFile(projectName, isReact, isHotReact),
      'package.json': 'empty package.json',
    },
    maybeConfigBabel,
    maybeConfigVue,
    maybeConfigTypescript,
    maybeSourceCodeVue(isVue, isTypescript),
    maybeSourceCodeReact(isReact, isHotReact, isTypescript),
    maybeSourceCodeTypescriptOnly(isTypescript, isReact, isVue),
    maybeSourceCodeEmpty
  )

  if (getNodeVersionPromise) {
    return getPackageJson(
      projectName,
      newNpmConfig.dependencies,
      newNpmConfig.devDependencies,
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
  const projectName = name || getDefaultProjectName('empty-project', features)
  const maybeConfigBabel =
    newBabelConfig && (isReact || isBabel)
      ? { '.babelrc': newBabelConfig }
      : null
  const maybeSourceCodeEmpty = !isReact
    ? { 'src/index.js': emptyIndexJs }
    : null

  const fileMap = _.assign(
    {},
    {
      'README.md': readmeFile(projectName, isReact, false),
    },
    maybeConfigBabel,
    maybeSourceCodeReact(isReact, false, false),
    maybeSourceCodeEmpty
  )

  const newNpmConfig = getNpmDependencies(features)
  // TODO there is some duplicated code here. sorry
  if (getNodeVersionPromise) {
    return getPackageJson(
      projectName,
      newNpmConfig.dependencies,
      newNpmConfig.devDependencies,
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
