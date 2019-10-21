import _ from 'lodash';

import {
  addModuleRule,
  getStyleLoaderOrVueStyleLoader,
  getStyleLoaderDependencyIfNeeded,
} from '../configurator-webpack-helpers';

import {
  css,
  scss,
  less,
  stylus,
  postCssConfig,
} from '../../templates/styling';

function cssRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(['css-loader'], getStyleLoaderDependencyIfNeeded(configItems)),
    webpack: (webpackConfig, configItems) => {
      const isPostCss = _.includes(configItems, 'PostCSS');
      const cssLoader = isPostCss
        ? {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          }
        : 'css-loader';
      const rule = {
        test: /\.css$/,
        use: _.concat(
          [getStyleLoaderOrVueStyleLoader(configItems), cssLoader],
          isPostCss ? 'postcss-loader' : []
        ),
      };
      if (_.includes(configItems, 'CSS Modules')) {
        rule.exclude = /\.module\.css$/;
      }
      return addModuleRule(webpackConfig, rule);
    },
    files: configItems => {
      const isVue = _.includes(configItems, 'Vue');
      const isSvelte = _.includes(configItems, 'Svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.css': css };
    },
  };
}

function cssModulesRules() {
  return {
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(['css-loader'], getStyleLoaderDependencyIfNeeded(configItems)),
    webpack: (webpackConfig, configItems) => {
      const isPostCss = _.includes(configItems, 'PostCSS');
      const rule = {
        test: /\.css$/,
        use: _.concat(
          [
            getStyleLoaderOrVueStyleLoader(configItems),
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
          isPostCss ? 'postcss-loader' : []
        ),
      };
      if (_.includes(configItems, 'CSS')) {
        rule.include = /\.module\.css$/;
      }
      return addModuleRule(webpackConfig, rule);
    },
  };
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
      const isVue = _.includes(configItems, 'Vue');
      const isSvelte = _.includes(configItems, 'Svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.scss': scss };
    },
  };
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
      const isVue = _.includes(configItems, 'Vue');
      const isSvelte = _.includes(configItems, 'Svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.less': less };
    },
  };
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
      const isVue = _.includes(configItems, 'Vue');
      const isSvelte = _.includes(configItems, 'Svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.styl': stylus };
    },
  };
}

function postCssRules() {
  return {
    group: 'Styling',
    devDependencies: configItems => ['postcss-loader', 'autoprefixer'],
    files: configItems => {
      return { 'postcss.config.js': postCssConfig };
    },
  };
}

export default {
  css: cssRules(),
  cssModules: cssModulesRules(),
  sass: sassRules(),
  less: lessRules(),
  stylus: stylusRules(),
  postCss: postCssRules(),
};
