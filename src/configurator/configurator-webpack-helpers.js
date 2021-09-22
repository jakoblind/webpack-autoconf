const _ = require('lodash');

export function addPlugin(webpackConfig, plugin) {
  if (!webpackConfig.plugins) {
    return { ...webpackConfig, plugins: [plugin] };
  }
  return { ...webpackConfig, plugins: _.concat(webpackConfig.plugins, plugin) };
}

export function assignModuleRuleAndResolver(
  webpackConfig,
  rules,
  resolverExts,
  aliases
) {
  const newWebpackConfig = addModuleRule(webpackConfig, rules);
  return resolverExts
    ? addResolverExtensions(newWebpackConfig, resolverExts, aliases)
    : newWebpackConfig;
}

export function addModuleRule(webpackConfig, ruleOrRules) {
  const isManyRules = _.isArray(ruleOrRules);
  const rules = isManyRules ? ruleOrRules : [ruleOrRules];

  if (!_.has(webpackConfig, 'module.rules')) {
    return {
      ...webpackConfig,
      module: {
        rules,
      },
    };
  }

  const newWebpackConfig = _.cloneDeep(webpackConfig);
  newWebpackConfig.module.rules = _.union(newWebpackConfig.module.rules, rules);
  return newWebpackConfig;
}

export function addResolverExtensions(webpackConfig, extOrExts, alias) {
  const isManyExtensions = _.isArray(extOrExts);
  const extensions = isManyExtensions ? extOrExts : [extOrExts];

  if (!_.has(webpackConfig, 'resolve')) {
    return {
      ...webpackConfig,
      resolve: {
        extensions,
        ...(_.isEmpty(alias) ? {} : { alias }),
      },
    };
  }

  const newWebpackConfig = _.cloneDeep(webpackConfig);
  newWebpackConfig.resolve.extensions = _.union(
    newWebpackConfig.resolve.extensions,
    extensions
  );

  return newWebpackConfig;
}

export const getStyleLoader = configItems => {
  const isMiniCssExtractPlugin = _.includes(
    configItems,
    'minicssextractplugin'
  );
  const isVue = _.includes(configItems, 'vue');
  if (isVue) {
    return 'vue-style-loader';
  } else {
    if (isMiniCssExtractPlugin) {
      return 'CODE:MiniCssExtractPlugin.loader';
    }
    return 'style-loader';
  }
};

export const getStyleLoaderDependencyIfNeeded = configItems =>
  _.includes(configItems, 'vue') ? [] : ['style-loader'];
