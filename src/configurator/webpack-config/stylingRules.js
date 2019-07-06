import _ from 'lodash'

import {
  addModuleRule,
  getStyleLoaderOrVueStyleLoader,
  getStyleLoaderDependencyIfNeeded,
} from '../configurator-webpack-helpers'

import { css, scss, less, stylus, postCssConfig } from '../../templates/styling'

function cssRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(['css-loader'], getStyleLoaderDependencyIfNeeded(configItems)),
    webpack: (webpackConfig, configItems) => {
      const rule = {
        test: /\.css$/,
        use: [getStyleLoaderOrVueStyleLoader(configItems), 'css-loader'],
      }
      if (_.includes(configItems, 'CSS Modules')) {
        rule.exclude = /\.module\.css$/
      }
      return addModuleRule(webpackConfig, rule)
    },
    files: configItems => {
      const isVue = _.includes(configItems, 'Vue')
      if (isVue) {
        return {}
      }
      return { 'src/styles.css': css }
    },
  }
}

function cssModulesRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(['css-loader'], getStyleLoaderDependencyIfNeeded(configItems)),
    webpack: (webpackConfig, configItems) => {
      const rule = {
        test: /\.css$/,
        use: [
          getStyleLoaderOrVueStyleLoader(configItems),
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        ],
      }
      if (_.includes(configItems, 'CSS')) {
        rule.include = /\.module\.css$/
      }
      return addModuleRule(webpackConfig, rule)
    },
  }
}

function sassRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(
        ['css-loader', 'sass-loader', 'node-sass'],
        getStyleLoaderDependencyIfNeeded(configItems)
      ),
    webpack: (webpackConfig, configItems) =>
      addModuleRule(webpackConfig, {
        test: /\.scss$/,
        use: [
          getStyleLoaderOrVueStyleLoader(configItems),
          'css-loader',
          'sass-loader',
        ],
      }),
    files: configItems => {
      const isVue = _.includes(configItems, 'Vue')
      if (isVue) {
        return {}
      }
      return { 'src/styles.scss': scss }
    },
  }
}

function lessRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(
        ['css-loader', 'less-loader', 'less'],
        getStyleLoaderDependencyIfNeeded(configItems)
      ),
    webpack: (webpackConfig, configItems) =>
      addModuleRule(webpackConfig, {
        test: /\.less$/,
        use: [
          getStyleLoaderOrVueStyleLoader(configItems),
          'css-loader',
          'less-loader',
        ],
      }),
    files: configItems => {
      const isVue = _.includes(configItems, 'Vue')
      if (isVue) {
        return {}
      }
      return { 'src/styles.less': less }
    },
  }
}

function stylusRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(
        ['css-loader', 'stylus-loader', 'stylus'],
        getStyleLoaderDependencyIfNeeded(configItems)
      ),
    webpack: (webpackConfig, configItems) =>
      addModuleRule(webpackConfig, {
        test: /\.styl$/,
        use: [
          getStyleLoaderOrVueStyleLoader(configItems),
          'css-loader',
          'stylus-loader',
        ],
      }),
    files: configItems => {
      const isVue = _.includes(configItems, 'Vue')
      if (isVue) {
        return {}
      }
      return { 'src/styles.styl': stylus }
    },
  }
}

function postCssRules() {
  return {
    group: 'Styling',
    files: configItems => {
      return { 'postcss.config.js': postCssConfig }
    },
  }
}

export default {
  css: cssRules(),
  cssModules: cssModulesRules(),
  sass: sassRules(),
  less: lessRules(),
  stylus: stylusRules(),
  postCss: postCssRules(),
}
