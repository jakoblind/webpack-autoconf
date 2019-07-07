import _ from 'lodash'

// this function is more or less copied from https://github.com/eslint/eslint/blob/master/lib/init/config-initializer.js
function createEsLintRc(answers = { moduleType: 'esm' }) {
  const DEFAULT_ECMA_VERSION = 2018
  let config = {
    rules: {},
    env: {},
    parserOptions: {},
    extends: [],
  }
  config.parserOptions.ecmaVersion = DEFAULT_ECMA_VERSION
  config.env.es6 = true
  config.globals = {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  }

  if (answers.moduleType === 'esm') {
    config.parserOptions.sourceType = 'module'
  } else if (answers.moduleType === 'commonjs') {
    config.env.commonjs = true
  }
  // add in browser and node environments if necessary
  answers.env.forEach(env => {
    config.env[env] = true
  })

  if (answers.framework === 'react') {
    config.parserOptions.ecmaFeatures = {
      jsx: true,
    }
    config.plugins = ['react']
  } else if (answers.framework === 'vue') {
    config.plugins = ['vue']
    config.extends.push('plugin:vue/essential')
  }
  if (answers.extends) {
    config.extends.push(answers.extends)
  }
  config.extends.unshift('eslint:recommended')
  // normalize extends
  if (config.extends.length === 0) {
    delete config.extends
  } else if (config.extends.length === 1) {
    config.extends = config.extends[0]
  }
  return JSON.stringify(config, null, 2)
}

const eslint = {
  group: 'Linting',
  devDependencies: configItems => ['eslint'],
  files: configItems => {
    const isReact = _.includes(configItems, 'React')
    const isVue = _.includes(configItems, 'Vue')
    const isPrettier = _.includes(configItems, 'Prettier')
    const esLintAnswers = {
      moduleType: 'esm',
      framework: isReact ? 'react' : isVue ? 'vue' : null,
      env: ['browser'],
      extends: isPrettier ? 'plugin:prettier/recommended' : null,
    }
    return { '.eslintrc.json': createEsLintRc(esLintAnswers) }
  },
}

const prettier = {
  group: 'Linting',
  devDependencies: configItems => {
    const isESLint = _.includes(configItems, 'ESLint')
    return _.concat(
      ['prettier'],
      isESLint ? ['eslint-config-prettier', 'eslint-plugin-prettier'] : []
    )
  },
}
export default {
  eslint,
  prettier,
}
