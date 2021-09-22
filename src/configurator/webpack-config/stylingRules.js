import _ from 'lodash';

import {
  addModuleRule,
  getStyleLoader,
  getStyleLoaderDependencyIfNeeded,
} from '../configurator-webpack-helpers';

import {
  css,
  scss,
  less,
  stylus,
  postCssConfig,
  tailwindcss,
} from '../../templates/styling';

function cssRules() {
  return {
    name: 'CSS',
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(['css-loader'], getStyleLoaderDependencyIfNeeded(configItems)),
    webpack: (webpackConfig, configItems) => {
      const isPostCss = _.includes(configItems, 'postcss');
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
          [getStyleLoader(configItems), cssLoader],
          isPostCss ? 'postcss-loader' : []
        ),
      };
      if (_.includes(configItems, 'css-modules')) {
        rule.exclude = /\.module\.css$/;
      }
      return addModuleRule(webpackConfig, rule);
    },
    files: configItems => {
      const isVue = _.includes(configItems, 'vue');
      const isSvelte = _.includes(configItems, 'svelte');
      if (isVue || isSvelte) {
        return {};
      }
      const isTailwindcss = _.includes(configItems, 'tailwind-css');
      return {
        'src/styles.css': isTailwindcss
          ? tailwindcss({ withPostCSS: true })
          : css,
      };
    },
  };
}

function cssModulesRules() {
  return {
    name: 'CSS Modules',
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(['css-loader'], getStyleLoaderDependencyIfNeeded(configItems)),
    webpack: (webpackConfig, configItems) => {
      const isPostCss = _.includes(configItems, 'postcss');
      const rule = {
        test: /\.css$/,
        use: _.concat(
          [
            getStyleLoader(configItems),
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
      if (_.includes(configItems, 'css')) {
        rule.include = /\.module\.css$/;
      }
      return addModuleRule(webpackConfig, rule);
    },
  };
}

function sassRules() {
  return {
    name: 'Sass',
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(
        ['css-loader', 'sass-loader', 'node-sass'],
        getStyleLoaderDependencyIfNeeded(configItems)
      ),
    webpack: (webpackConfig, configItems) =>
      addModuleRule(webpackConfig, {
        test: /\.scss$/,
        use: [getStyleLoader(configItems), 'css-loader', 'sass-loader'],
      }),
    files: configItems => {
      const isVue = _.includes(configItems, 'vue');
      const isSvelte = _.includes(configItems, 'svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.scss': scss };
    },
  };
}

function lessRules() {
  return {
    name: 'Less',
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(
        ['css-loader', 'less-loader', 'less'],
        getStyleLoaderDependencyIfNeeded(configItems)
      ),
    webpack: (webpackConfig, configItems) =>
      addModuleRule(webpackConfig, {
        test: /\.less$/,
        use: [getStyleLoader(configItems), 'css-loader', 'less-loader'],
      }),
    files: configItems => {
      const isVue = _.includes(configItems, 'vue');
      const isSvelte = _.includes(configItems, 'svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.less': less };
    },
  };
}

function stylusRules() {
  return {
    name: 'stylus',
    group: 'Styling',
    devDependencies: configItems =>
      _.concat(
        ['css-loader', 'stylus-loader', 'stylus'],
        getStyleLoaderDependencyIfNeeded(configItems)
      ),
    webpack: (webpackConfig, configItems) =>
      addModuleRule(webpackConfig, {
        test: /\.styl$/,
        use: [getStyleLoader(configItems), 'css-loader', 'stylus-loader'],
      }),
    files: configItems => {
      const isVue = _.includes(configItems, 'vue');
      const isSvelte = _.includes(configItems, 'svelte');
      if (isVue || isSvelte) {
        return {};
      }
      return { 'src/styles.styl': stylus };
    },
  };
}

function postCssRules() {
  return {
    name: 'PostCSS',
    group: 'Styling',
    devDependencies: configItems => ['postcss-loader', 'autoprefixer'],
    files: configItems => {
      const isTailwindcss = _.includes(configItems, 'tailwind-css');
      return { 'postcss.config.js': postCssConfig(isTailwindcss) };
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
