import _ from 'lodash'

import combinations from 'combinations'
import Promise from 'bluebird'

import fs from 'fs'
import childProcess from 'child_process'
import { features } from './src/configurator/configurator-config'

import {
  createWebpackConfig,
  createBabelConfig,
  getNpmDependencies,
  getDefaultProjectName,
  getPackageJson,
} from './src/configurator/configurator'
import { readmeFile } from './src/templates/base'
import {
  reactIndexJs,
  reactIndexTsx,
  reactHotIndexJs,
  reactIndexHtml,
} from './src/templates/react/index'
import { emptyIndexJs } from './src/templates/empty/index'
import {
  indexTypescriptHTML,
  tsconfig,
  tsconfigReact,
} from './src/templates/ts'
import {
  vueHelloWorldJs,
  vueHelloWorldTS,
  vueIndexAppVue,
  vueIndexHtml,
  vueIndexTs,
  vueShimType,
} from './src/templates/vue'

import projectGenerator from './src/configurator/project-generator'

function exec(command) {
  return new Promise(function(resolve, reject) {
    childProcess.exec(command, function(error, stdout, stderr) {
      if (error) {
        return reject(error)
      }

      resolve({ stdout, stderr })
    })
  })
}

function getFeatureCombinations() {
  const allFeatures = _.keys(features)
  const notSupportedFeatures = []

  const featuresCombinations = _.reject(allFeatures, feature =>
    _.includes(notSupportedFeatures, feature)
  )

  return combinations(featuresCombinations)
}

const nodeVersionMap = {}
function getNodeVersionPromise(name) {
  if (nodeVersionMap[name]) {
    return nodeVersionMap[name]
  }
  // TODO: error handling!
  return exec(`npm show ${name} version`).then(({ stdout }) => {
    const version = '^' + stdout.replace(/\n$/, '')
    nodeVersionMap[name] = version
    return version
  })
}

function writeFile(path, content) {
  fs.writeFileSync(path, content)
}

function mkDir(path) {
  if (path && !fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

function generateProject(requestedFeatures, { basePath, name }) {
  const isReact = _.includes(requestedFeatures, 'React')
  const isVue = _.includes(requestedFeatures, 'Vue')
  const isTypescript = _.includes(requestedFeatures, 'Typescript')
  const isBabel = _.includes(requestedFeatures, 'Babel')
  const isHotReact = _.includes(requestedFeatures, 'React hot loader')
  const indexSuffix = isTypescript ? 'ts' : 'js'

  if (isHotReact && !isReact) {
    console.log('Cannot configure React hot loading without configuring React')
    return
  }

  if (isHotReact && isTypescript) {
    console.log('Typescript with React hot loading currently not supported')
    return
  }

  if (isReact && isVue) {
    console.log(
      'React and Vue in same project not currently supported. Pick one'
    )
    return
  }

  if (isReact && (!isTypescript && !isBabel)) {
    console.log('Select either Babel or Typescript when using React')
    return
  }

  const projectName =
    name || getDefaultProjectName('empty-project', requestedFeatures)
  const fullPath = (basePath || '.') + '/' + projectName + '/'

  const newNpmConfig = getNpmDependencies(requestedFeatures)
  const newWebpackConfig = createWebpackConfig(requestedFeatures)
  const newBabelConfig = createBabelConfig(requestedFeatures)

  console.log('Generating ' + projectName + '...')

  mkDir(basePath)
  mkDir(fullPath)
  const files = projectGenerator(requestedFeatures, name)

  _.forEach(files, (content, filename) => {
    // only support one level directories right now.
    if (_.includes(filename, '/')) {
      const dirs = _.split(filename, '/')
      mkDir(fullPath + dirs[0])
    }

    writeFile(fullPath + filename, content)
  })

  return getPackageJson(
    'empty-project-' + _.kebabCase(requestedFeatures),
    newNpmConfig.dependencies,
    newNpmConfig.devDependencies,
    getNodeVersionPromise,
    requestedFeatures
  ).then(newPackageJson => {
    writeFile(
      fullPath + 'package.json',
      JSON.stringify(newPackageJson, null, 2)
    )
    console.log('Done generating ' + projectName + '!')
    return projectName
  })
}
// TODO: check if all of requestedFeatures are supported
const [a, b, command, name, ...requestedFeatures] = process.argv

if (command === 'new') {
  generateProject(requestedFeatures, { name })
} else if (command === 'all') {
  // for some reason Promise.reduce ignores the first item in the list so we add one extra empty feature [[]]
  const combinations = _.concat([[]], [[]], getFeatureCombinations())

  Promise.reduce(combinations, (_, features) => {
    return generateProject(features, { basePath: 'generated' })
  })
} else {
  console.log('Usage: webpack-autoconf new [project-name] [features]')
  console.log('')
  console.log('Where [features] can be any combination of:')
  _.forEach(_.keys(features), feature => console.log('  - ' + feature))
  console.log('')
  console.log('Example: webpack-autoconf new myProject React PNG')
  console.log('')
}
