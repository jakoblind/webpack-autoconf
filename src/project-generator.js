import _ from 'lodash'

import { readmeFile } from './templates/base'

import {
  createWebpackConfig,
  createBabelConfig,
  getDefaultProjectName,
} from './configurator'
import {
  vueHelloWorldJs,
  vueHelloWorldTS,
  vueIndexAppVue,
  vueIndexHtml,
  vueIndexTs,
  vueShimType,
} from './templates/vue'

import {
  reactIndexJs,
  reactIndexTsx,
  reactHotIndexJs,
  reactIndexHtml,
} from './templates/react/index'
import { emptyIndexJs } from './templates/empty/index'

import { indexTypescriptHTML, tsconfig, tsconfigReact } from './templates/ts'

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
  this function returns a map with all files
  needed for the features selected.

  package.json not included because it's generated
  differently on backend and on frontend because
  it needs to fetch dependencies
*/
function generateProject(features, name) {
  const isBabel = _.includes(features, 'Babel')
  const isReact = _.includes(features, 'React')
  const isVue = _.includes(features, 'Vue')
  const isTypescript = _.includes(features, 'Typescript')
  const isHotReact = _.includes(features, 'React hot loader')

  const newWebpackConfig = createWebpackConfig(features)
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

  return _.assign(
    {},
    {
      'webpack.config.js': newWebpackConfig,
      'README.md': readmeFile(projectName, isReact, isHotReact),
    },
    maybeConfigBabel,
    maybeConfigVue,
    maybeConfigTypescript,
    maybeSourceCodeVue(isVue, isTypescript),
    maybeSourceCodeReact(isReact, isHotReact, isTypescript),
    maybeSourceCodeTypescriptOnly(isTypescript, isReact, isVue),
    maybeSourceCodeEmpty
  )
}

export default generateProject
