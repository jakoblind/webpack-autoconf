import _ from 'lodash';
import {
  reactIndexJs,
  reactIndexTsx,
  reactAppJs,
  reactAppTsx,
} from '../../templates/react/index';
import { indexHtml } from '../../templates/base';
import { svelteIndexJs, svelteAppSvelte } from '../../templates/svelte/index';

import {
  addPlugin,
  assignModuleRuleAndResolver,
  addModuleRule,
} from '../configurator-webpack-helpers';
import { vueIndexAppVue, vueIndexTs, vueShimType } from '../../templates/vue';
import { emptyIndexJs } from '../../templates/empty/index';

import { tsconfig, tsconfigReact } from '../../templates/ts';

import { getStyleTags } from '../../templates/styling';
import stylingRules from './stylingRules';
import lintingRules from '../common-config/linting';
import unitTestsRules from '../common-config/unitTests';

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, 'css');
  const isSass = _.includes(configItems, 'sass');
  const isLess = _.includes(configItems, 'less');
  const isStylus = _.includes(configItems, 'stylus');
  return _.concat(
    [],
    isCss ? [`import "./styles.css";`] : [],
    isSass ? [`import "./styles.scss";`] : [],
    isLess ? [`import "./styles.less";`] : [],
    isStylus ? [`import "./styles.styl";`] : []
  );
}

export default (() => {
  const features = {
    'no-library': {
      name: 'No library',
      group: 'Main library',
    },
    react: {
      name: 'React',
      group: 'Main library',
      dependencies: (configItems) => ['react', 'react-dom'],
      devDependencies: (configItems) => {
        const isTypescript = _.includes(configItems, 'typescript');
        const isBabel = _.includes(configItems, 'babel');
        return _.concat(
          [],
          isTypescript ? ['@types/react', '@types/react-dom'] : [],
          isBabel ? ['@babel/preset-react'] : []
        );
      },
      files: (configItems) => {
        const isTypescript = _.includes(configItems, 'typescript');
        const isHotReact = _.includes(configItems, 'react-hot-loader');
        const extraImports = getStyleImports(configItems);

        if (isTypescript) {
          return {
            'src/App.tsx': reactAppTsx(configItems),
            'src/index.tsx': reactIndexTsx(extraImports, isHotReact),
          };
        }

        return {
          'src/App.js': reactAppJs(configItems),
          'src/index.js': reactIndexJs(extraImports),
        };
      },
    },
    svelte: {
      name: 'Svelte',
      group: 'Main library',
      devDependencies: (configItems) => [
        'svelte',
        'svelte-loader',
        'svelte-preprocess',
      ],
      webpack: (webpackConfig, configItems) => {
        const isPostCSS = _.includes(configItems, 'postcss');
        const webpackConfigWithRule = assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: /\.svelte$/,
              loader: 'svelte-loader',
              options: {
                preprocess: `CODE: require('svelte-preprocess')({${
                  isPostCSS ? ` postcss: true ` : ''
                }})`,
              },
            },
          ],
          ['.mjs', '.js', '.svelte']
        );
        return webpackConfigWithRule;
      },
      files: (configItems) => {
        const styling = getStyleTags(configItems);
        return {
          'src/index.js': svelteIndexJs(),
          'src/App.svelte': svelteAppSvelte(
            _.join(styling, '\n\n'),
            configItems
          ),
        };
      },
    },
    vue: {
      name: 'Vue',
      group: 'Main library',
      webpackImports: [
        "const { VueLoaderPlugin } = require('vue-loader');",
      ],
      webpack: (webpackConfig) => {
        const webpackConfigWithRule = assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
          ],
          ['.js', '.vue']
        );
        return addPlugin(webpackConfigWithRule, 'CODE:new VueLoaderPlugin()');
      },
      devDependencies: (configItems) => [
        'vue-loader',
        'vue-template-compiler',
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
      ],
      dependencies: (configItems) => ['vue'],
      files: (configItems) => {
        const isTypescript = _.includes(configItems, 'typescript');
        const indexFilename = isTypescript ? 'src/index.ts' : 'src/index.js';
        const styling = getStyleTags(configItems);

        return _.assign(
          {
            'src/App.vue': vueIndexAppVue(_.join(styling, '\n'), configItems),
            [indexFilename]: vueIndexTs(),
          },
          isTypescript ? { 'src/vue-shim.d.ts': vueShimType } : {}
        );
      },
    },
    bootstrap: {
      name: 'Bootstrap',
      group: 'UI library',
      dependencies: (configItems) => ['bootstrap', 'jquery', 'popper.js'],
    },
    'tailwind-css': {
      name: 'Tailwind CSS',
      group: 'UI library',
      dependencies: (configItems) => ['tailwindcss'],
    },
    'material-ui': {
      name: 'Material UI',
      group: 'UI library',
      dependencies: (configItems) => [
        '@material-ui/core',
        'fontsource-roboto',
        '@material-ui/icons',
      ],
    },
    jest: unitTestsRules.jest,
    mocha: unitTestsRules.mocha,
    chai: unitTestsRules.chai,
    jasmine: unitTestsRules.jasmine,
    ava: unitTestsRules.ava,
    cypress: unitTestsRules.cypress,
    testcafe: unitTestsRules.testcafe,
    babel: {
      name: 'Babel',
      group: 'Transpiler',
      babel: (babelConfig, configItems) => ({
        ...babelConfig,
        presets: _.concat(
          [['@babel/preset-env', { modules: false }]],
          _.includes(configItems, 'react') ? '@babel/preset-react' : []
        ),
      }),
      devDependencies: (configItems) => {
        const devDepList = ['babel-loader', '@babel/core', '@babel/preset-env'];
        if (_.includes(configItems, 'react-hot-loader'))
          devDepList.push('@hot-loader/react-dom');
        return devDepList;
      },
      webpack: (webpackConfig, configItems) =>
        assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: _.includes(configItems, 'react') ? /\.(js|jsx)$/ : /\.js$/,
              use: 'babel-loader',
              exclude: /node_modules/,
            },
          ],
          _.includes(configItems, 'React') ? ['.js', '.jsx'] : null,
          _.includes(configItems, 'react-hot-loader')
            ? { 'react-dom': '@hot-loader/react-dom' }
            : {}
        ),
    },
    typescript: {
      name: 'Typescript',
      group: 'Transpiler',
      devDependencies: (configItems) => {
        const devDepList = ['typescript', 'ts-loader'];
        if (_.includes(configItems, 'react-hot-loader'))
          devDepList.push('@hot-loader/react-dom');
        return devDepList;
      },
      webpack: (webpackConfig, configItems) => {
        const isVue = _.includes(configItems, 'vue');
        const typescriptModule = {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        };
        if (isVue) {
          typescriptModule.options = {
            appendTsSuffixTo: [/\.vue$/],
          };
        }
        const aliases = {};
        const isHot = _.includes(configItems, 'react-hot-loader');
        if (isHot) {
          aliases['react-dom'] = '@hot-loader/react-dom';
        }
        return assignModuleRuleAndResolver(
          webpackConfig,
          typescriptModule,
          ['.tsx', '.ts', '.js'],
          aliases
        );
      },
      files: (configItems) => {
        const isReact = _.includes(configItems, 'react');
        const isVue = _.includes(configItems, 'vue');

        const configFiles = isReact
          ? { 'tsconfig.json': tsconfigReact }
          : { 'tsconfig.json': tsconfig };
        const sourceFiles =
          !isReact && !isVue
            ? {
                'src/index.ts': emptyIndexJs(),
              }
            : {};
        return _.assign(configFiles, sourceFiles);
      },
    },
    css: stylingRules.css,
    'css-modules': stylingRules.cssModules,
    postcss: stylingRules.postCss,
    sass: stylingRules.sass,
    less: stylingRules.less,
    stylus: stylingRules.stylus,
    svg: {
      name: 'SVG',
      group: 'Image',
      devDependencies: (configItems) => ['file-loader'],
      webpack: (webpackConfig) =>
        addModuleRule(webpackConfig, {
          test: /\.svg$/,
          use: 'file-loader',
        }),
    },
    png: {
      name: 'PNG',
      group: 'Image',
      devDependencies: (configItems) => ['url-loader'],
      webpack: (webpackConfig) =>
        addModuleRule(webpackConfig, {
          test: /\.png$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                mimetype: 'image/png',
              },
            },
          ],
        }),
    },
    moment: {
      name: 'moment',
      group: 'Utilities',
      dependencies: (configItems) => ['moment'],
      webpack: (webpackConfig) =>
        addPlugin(
          webpackConfig,
          'CODE:new webpack.ContextReplacementPlugin(/moment[\\/\\\\]locale$/, /en/)'
        ), // eslint-disable-line
    },
    lodash: {
      name: 'lodash',
      group: 'Utilities',
      babel: _.identity,
      dependencies: (configItems) => ['lodash'],
      devDependencies: (configItems) => ['lodash-webpack-plugin'],
      webpackImports: [
        "const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');",
      ],
      webpack: (webpackConfig) =>
        addPlugin(webpackConfig, 'CODE:new LodashModuleReplacementPlugin'),
    },
    eslint: lintingRules.eslint,
    prettier: lintingRules.prettier,
    'code-split-vendors': {
      name: 'Code split vendors',
      group: 'Optimization',
      webpack: (webpackConfig) => {
        const withFilename = _.setWith(
          webpackConfig,
          'output.filename',
          '[name].[contenthash].js',
          _.clone
        );
        return _.setWith(
          _.clone(withFilename),
          'optimization',
          {
            runtimeChunk: 'single',
            splitChunks: {
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all',
                },
              },
            },
          },
          _.clone
        );
      },
    },
    'html-webpack-plugin': {
      name: 'HTML webpack plugin',
      group: 'Webpack plugins',
      devDependencies: (configItems) => ['html-webpack-plugin'],
      webpackImports: [
        "const HtmlWebpackPlugin = require('html-webpack-plugin');",
      ],
      webpack: (webpackConfig) => {
        return addPlugin(
          webpackConfig,
          `CODE:new HtmlWebpackPlugin({
  templateContent: ({ htmlWebpackPlugin }) => '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + htmlWebpackPlugin.options.title + '</title></head><body><div id="app"></div></body></html>',
  filename: 'index.html',
})`
        );
      },
    },
    'webpack-bundle-analyzer': {
      name: 'Webpack Bundle Analyzer',
      group: 'Webpack plugins',
      devDependencies: (configItems) => ['webpack-bundle-analyzer'],
      webpackImports: [
        "const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;",
      ],
      webpack: (webpackConfig) => {
        return addPlugin(
          webpackConfig,
          `CODE:new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false,
})`
        );
      },
    },
    minicssextractplugin: {
      name: 'MiniCssExtractPlugin',
      group: 'Webpack plugins',
      devDependencies: (configItems) => ['mini-css-extract-plugin'],
      webpackImports: [
        "const MiniCssExtractPlugin = require('mini-css-extract-plugin');",
      ],
      webpack: (webpackConfig) => {
        return addPlugin(webpackConfig, `CODE:new MiniCssExtractPlugin()`);
      },
    },
    copywebpackplugin: {
      name: 'CopyWebpackPlugin',
      group: 'Webpack plugins',
      devDependencies: (configItems) => ['copy-webpack-plugin'],
      webpackImports: ["const CopyPlugin = require('copy-webpack-plugin');"],
      webpack: (webpackConfig) => {
        return addPlugin(
          webpackConfig,
          `CODE:new CopyPlugin({
  patterns: [{ from: 'src/index.html' }],
})`
        );
      },
    },
    cleanwebpackplugin: {
      name: 'CleanWebpackPlugin',
      group: 'Webpack plugins',
      devDependencies: (configItems) => ['clean-webpack-plugin'],
      webpackImports: [
        `const { CleanWebpackPlugin } = require('clean-webpack-plugin');`,
      ],
      webpack: (webpackConfig) => {
        return addPlugin(webpackConfig, `CODE:new CleanWebpackPlugin()`);
      },
    },
    'react-hot-loader': {
      name: 'React hot loader',
      group: 'React',
      babel: (babelConfig, configItems) => {
        if (!_.includes(configItems, 'babel')) return {}; // We don't need babelrc for typescript
        return { ...babelConfig, plugins: ['react-hot-loader/babel'] };
      },
      dependencies: (configItems) => ['react-hot-loader'],
      devDependencies: (configItems) => ['webpack-dev-server'],
      webpack: (webpackConfig) => ({
        ...webpackConfig,
        devServer: {
          static: {
            directory: './dist',
          },
        },
      }),
      packageJson: {
        scripts: {
          start: 'webpack serve --hot --mode development',
        },
      },
    },
  };
  const featuresNoNulls = _.mapValues(features, (item) => {
    if (!item.babel) {
      item.babel = _.identity;
    }
    if (!item.webpack) {
      item.webpack = _.identity;
    }
    if (!item.webpackImports) {
      item.webpackImports = [];
    }
    if (!item.dependencies) {
      item.dependencies = () => [];
    }
    if (!item.devDependencies) {
      item.devDependencies = () => [];
    }
    if (!item.packageJson) {
      item.packageJson = {};
    }
    if (!item.files) {
      item.files = () => {};
    }

    return item;
  });
  return {
    features: featuresNoNulls,
    base: {
      packageJson: {
        scripts: {
          'build-dev': 'webpack --mode development',
          'build-prod': 'webpack --mode production',
        },
      },
      devDependencies: ['webpack', 'webpack-cli'],
      files: (configItems) => {
        const isTypescript = _.includes(configItems, 'typescript');
        const isCopyPlugin = _.includes(configItems, 'copywebpackplugin');

        const isHTMLWebpackPlugin = _.includes(
          configItems,
          'html-webpack-plugin'
        );
        const isMiniCssExtractPlugin = _.includes(
          configItems,
          'minicssextractplugin'
        );

        const files = {};

        if (!isTypescript) {
          files['src/index.js'] = emptyIndexJs(getStyleImports(configItems));
        }

        if (!isHTMLWebpackPlugin) {
          const distPath = isCopyPlugin ? 'src/index.html' : 'dist/index.html';
          files[distPath] = indexHtml({
            bundleFilename: 'bundle.js',
            cssFilename: isMiniCssExtractPlugin ? 'main.css' : null,
          });
        }

        return files;
      },
    },
  };
})();
