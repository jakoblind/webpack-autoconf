import _ from 'lodash'
import {
  reactIndexJs,
  reactIndexTsx,
  reactAppJs,
} from '../../templates/react/index'

import {
  addPlugin,
  assignModuleRuleAndResolver,
  addModuleRule,
} from '../configurator-webpack-helpers'
import { vueIndexAppVue, vueIndexTs, vueShimType } from '../../templates/vue'
import { indexHtml } from '../../templates/base'
import { emptyIndexJs } from '../../templates/empty/index'

import { tsconfig, tsconfigReact } from '../../templates/ts'

import { css, scss, less, stylus } from '../../templates/styling'
import stylingRules from './stylingRules'
import lintingRules from '../common-config/linting'

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, 'CSS')
  const isSass = _.includes(configItems, 'Sass')
  const isLess = _.includes(configItems, 'Less')
  const isStylus = _.includes(configItems, 'stylus')
  return _.concat(
    [],
    isCss ? [`import "./styles.css";`] : [],
    isSass ? [`import "./styles.scss";`] : [],
    isLess ? [`import "./styles.less";`] : [],
    isStylus ? [`import "./styles.styl";`] : []
  )
}
export default (() => {
  const features = {
    React: {
      group: 'Main library',
      dependencies: configItems => ['react', 'react-dom'],
      devDependencies: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript')
        const isBabel = _.includes(configItems, 'Babel')
        return _.concat(
          [],
          isTypescript ? ['@types/react', '@types/react-dom'] : [],
          isBabel ? ['@babel/preset-react'] : []
        )
      },
      files: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript')
        const isHotReact = _.includes(configItems, 'React hot loader') // Bug fix: Should check on configItems
        const extraImports = getStyleImports(configItems)
        if (isTypescript) {
          return {
            'src/index.tsx': reactIndexTsx(extraImports),
            'dist/index.html': indexHtml(),
          }
        } else {
          return {
            'src/app.js': reactAppJs(isHotReact),
            'src/index.js': reactIndexJs(extraImports),
            'dist/index.html': indexHtml(),
          }
        }
      },
    },
    Vue: {
      group: 'Main library',
      webpackImports: [
        "const VueLoaderPlugin = require('vue-loader/lib/plugin');",
      ],
      webpack: webpackConfig => {
        const webpackConfigWithRule = assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
          ],
          ['.js', '.vue']
        )
        return addPlugin(webpackConfigWithRule, 'CODE:new VueLoaderPlugin()')
      },
      devDependencies: configItems => [
        'vue-loader',
        'vue-template-compiler',
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
      ],
      dependencies: configItems => ['vue'],
      files: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript')
        const indexFilename = isTypescript ? 'src/index.ts' : 'src/index.js'
        const isCss = _.includes(configItems, 'CSS')
        const isLess = _.includes(configItems, 'Less')
        const isSass = _.includes(configItems, 'Sass')
        const isStylus = _.includes(configItems, 'stylus')
        const cssStyle = `<style>
${css}
</style>`
        const lessStyle = `<style lang="less">
${less}
</style>`
        const sassStyle = `<style lang="scss">
${scss}
</style>`
        const stylusStyle = `<style lang="styl">
${stylus}
</style>`
        const styling = _.concat(
          [],
          isCss ? cssStyle : [],
          isSass ? sassStyle : [],
          isLess ? lessStyle : [],
          isStylus ? stylusStyle : []
        )

        return _.assign(
          {
            'src/App.vue': vueIndexAppVue(_.join(styling, '\n')),
            'dist/index.html': indexHtml(),
            [indexFilename]: vueIndexTs(),
          },
          isTypescript ? { 'vue-shim.d.ts': vueShimType } : {}
        )
      },
    },
    Babel: {
      group: 'Transpiler',
      babel: (babelConfig, configItems) =>
        Object.assign({}, babelConfig, {
          presets: _.concat(
            [['@babel/preset-env', { modules: false }]],
            _.includes(configItems, 'React') ? '@babel/preset-react' : []
          ),
        }),
      devDependencies: configItems => [
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
      ],
      webpack: (webpackConfig, configItems) =>
        assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: _.includes(configItems, 'React') ? /\.(js|jsx)$/ : /\.js$/,
              use: 'babel-loader',
              exclude: /node_modules/,
            },
          ],
          _.includes(configItems, 'React') ? ['.js', '.jsx'] : null
        ),
    },
    Typescript: {
      group: 'Transpiler',
      devDependencies: configItems => ['typescript', 'ts-loader'],
      webpack: (webpackConfig, configItems) => {
        const isVue = _.includes(configItems, 'Vue')
        const typescriptModule = {
          test: /\.(ts|tsx)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        }
        if (isVue) {
          typescriptModule.options = {
            appendTsSuffixTo: [/\.vue$/],
          }
        }
        return assignModuleRuleAndResolver(webpackConfig, typescriptModule, [
          '.tsx',
          '.ts',
          '.js',
        ])
      },
      files: configItems => {
        const isReact = _.includes(configItems, 'React')
        const isVue = _.includes(configItems, 'Vue')

        const configFiles = isReact
          ? { 'tsconfig.json': tsconfigReact }
          : { 'tsconfig.json': tsconfig }
        const sourceFiles =
          !isReact && !isVue
            ? {
                'dist/index.html': indexHtml(),
                'src/index.ts': emptyIndexJs(),
              }
            : {}
        return _.assign(configFiles, sourceFiles)
      },
    },
    CSS: stylingRules.css,
    'CSS Modules': stylingRules.cssModules,
    PostCSS: stylingRules.postCss,
    Sass: stylingRules.sass,
    Less: stylingRules.less,
    stylus: stylingRules.stylus,
    SVG: {
      group: 'Image',
      devDependencies: configItems => ['file-loader'],
      webpack: webpackConfig =>
        addModuleRule(webpackConfig, {
          test: /\.svg$/,
          use: 'file-loader',
        }),
    },
    PNG: {
      group: 'Image',
      devDependencies: configItems => ['url-loader'],
      webpack: webpackConfig =>
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
      group: 'Utilities',
      dependencies: configItems => ['moment'],
      webpack: webpackConfig =>
        addPlugin(
          webpackConfig,
          'CODE:new webpack.ContextReplacementPlugin(/moment[\\/\\\\]locale$/, /en/)'
        ), // eslint-disable-line
    },
    lodash: {
      group: 'Utilities',
      babel: _.identity,
      dependencies: configItems => ['lodash'],
      devDependencies: configItems => ['lodash-webpack-plugin'],
      webpackImports: [
        "const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');",
      ],
      webpack: webpackConfig =>
        addPlugin(webpackConfig, 'CODE:new LodashModuleReplacementPlugin'),
    },
    ESLint: lintingRules.eslint,
    Prettier: lintingRules.prettier,
    'Code split vendors': {
      group: 'Optimization',
      devDependencies: configItems => [
        'html-webpack-plugin',
        'html-webpack-template',
      ],
      webpackImports: [
        "const HtmlWebpackPlugin = require('html-webpack-plugin');",
      ],
      webpack: webpackConfig => {
        const withPlugin = addPlugin(
          webpackConfig,
          `CODE:new HtmlWebpackPlugin({
    template: require('html-webpack-template'),
    inject: false,
    appMountId: 'app',
  })`
        )

        const withFilename = _.setWith(
          _.clone(withPlugin),
          'output.filename',
          '[name].[contenthash].js',
          _.clone
        )
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
        )
      },
    },
    'React hot loader': {
      group: 'React',
      babel: babelConfig =>
        Object.assign({}, babelConfig, {
          plugins: ['react-hot-loader/babel'],
        }),
      dependencies: configItems => ['react-hot-loader'],
      devDependencies: configItems => ['webpack-dev-server'],
      webpack: webpackConfig =>
        Object.assign({}, webpackConfig, {
          devServer: {
            contentBase: './dist',
          },
        }),
      packageJson: {
        scripts: {
          start: 'webpack-dev-server --hot --mode development',
        },
      },
    },
  }
  const featuresNoNulls = _.mapValues(features, item => {
    if (!item.babel) {
      item.babel = _.identity
    }
    if (!item.webpack) {
      item.webpack = _.identity
    }
    if (!item.webpackImports) {
      item.webpackImports = []
    }
    if (!item.dependencies) {
      item.dependencies = () => []
    }
    if (!item.devDependencies) {
      item.devDependencies = () => []
    }
    if (!item.packageJson) {
      item.packageJson = {}
    }
    if (!item.files) {
      item.files = () => {}
    }

    return item
  })
  return {
    features: featuresNoNulls,
    base: {
      packageJson: {
        scripts: {
          'build-dev': 'webpack -d --mode development',
          'build-prod': 'webpack -p --mode production',
        },
      },
      devDependencies: ['webpack', 'webpack-cli'],
      files: configItems => {
        const isReact = _.includes(configItems, 'React')
        const isVue = _.includes(configItems, 'Vue')
        const isTypescript = _.includes(configItems, 'Typescript')
        const extraImports = getStyleImports(configItems)
        if (!isTypescript && !isReact && !isVue) {
          return {
            'src/index.js': emptyIndexJs(extraImports),
            'dist/index.html': indexHtml(),
          }
        } else {
          return []
        }
      },
    },
  }
})()
