const _ = require('lodash')

export function addPlugin(webpackConfig, plugin) {
  if (!webpackConfig.plugins) {
    return Object.assign({}, webpackConfig, {
      plugins: [plugin],
    })
  }
  return Object.assign({}, webpackConfig, {
    plugins: _.concat(webpackConfig.plugins, plugin),
  })
}

export function assignModuleRuleAndResolver(
  webpackConfig,
  rules,
  resolverExts,
  aliases
) {
  const newWebpackConfig = addModuleRule(webpackConfig, rules)
  return resolverExts
    ? addResolverExtensions(newWebpackConfig, resolverExts, aliases)
    : newWebpackConfig
}

export function addModuleRule(webpackConfig, ruleOrRules) {
  const isManyRules = _.isArray(ruleOrRules)
  const rules = isManyRules ? ruleOrRules : [ruleOrRules]

  if (!_.has(webpackConfig, 'module.rules')) {
    return Object.assign({}, webpackConfig, {
      module: {
        rules,
      },
    })
  }

  const newWebpackConfig = _.cloneDeep(webpackConfig)
  newWebpackConfig.module.rules = _.union(newWebpackConfig.module.rules, rules)
  return newWebpackConfig
}

export function addResolverExtensions(webpackConfig, extOrExts, alias) {
  const isManyExtensions = _.isArray(extOrExts)
  const extensions = isManyExtensions ? extOrExts : [extOrExts]

  if (!_.has(webpackConfig, 'resolve')) {
    return Object.assign({}, webpackConfig, {
      resolve: {
        extensions,
        ...(alias && Object.keys(alias).length ? { alias } : {}),
      },
    })
  }

  const newWebpackConfig = _.cloneDeep(webpackConfig)
  newWebpackConfig.resolve.extensions = _.union(
    newWebpackConfig.resolve.extensions,
    extensions
  )

  return newWebpackConfig
}

export const getStyleLoaderOrVueStyleLoader = configItems =>
  _.includes(configItems, 'Vue') ? 'vue-style-loader' : 'style-loader'

export const getStyleLoaderDependencyIfNeeded = configItems =>
  _.includes(configItems, 'Vue') ? [] : ['style-loader']
