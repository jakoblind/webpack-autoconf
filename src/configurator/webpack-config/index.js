import _ from "lodash";
import {
  reactIndexJs,
  reactIndexTsx,
  reactAppJs,
  reactAppTsx
} from "../../templates/react/index";
import { indexHtml } from "../../templates/base";
import { svelteIndexJs, svelteAppSvelte } from "../../templates/svelte/index";

import {
  addPlugin,
  assignModuleRuleAndResolver,
  addModuleRule
} from "../configurator-webpack-helpers";
import { vueIndexAppVue, vueIndexTs, vueShimType } from "../../templates/vue";
import { emptyIndexJs } from "../../templates/empty/index";

import { tsconfig, tsconfigReact } from "../../templates/ts";

import { css, scss, less, stylus } from "../../templates/styling";
import stylingRules from "./stylingRules";
import lintingRules from "../common-config/linting";
import unitTestsRules from "../common-config/unitTests";

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, "CSS");
  const isSass = _.includes(configItems, "Sass");
  const isLess = _.includes(configItems, "Less");
  const isStylus = _.includes(configItems, "stylus");
  return _.concat(
    [],
    isCss ? [`import "./styles.css";`] : [],
    isSass ? [`import "./styles.scss";`] : [],
    isLess ? [`import "./styles.less";`] : [],
    isStylus ? [`import "./styles.styl";`] : []
  );
}

function getStyleTags(configItems) {
  const isCss = _.includes(configItems, "CSS");
  const isLess = _.includes(configItems, "Less");
  const isSass = _.includes(configItems, "Sass");
  const isStylus = _.includes(configItems, "stylus");
  const isTailwindCSS = _.includes(configItems, "Tailwind CSS");
  const cssStyle = `<style>
${css}
</style>`;
  const lessStyle = `<style lang="less">
${less}
</style>`;
  const sassStyle = `<style lang="scss">
${scss}
</style>`;
  const stylusStyle = `<style lang="styl">
${stylus}
</style>`;
  const tailwindcssStyle = `<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>`;

  return _.concat(
    [],
    isCss && !isTailwindCSS ? cssStyle : [],
    isSass ? sassStyle : [],
    isLess ? lessStyle : [],
    isStylus ? stylusStyle : [],
    isTailwindCSS ? tailwindcssStyle : []
  );
}

export default (() => {
  const features = {
    "No library": {
      group: "Main library"
    },
    React: {
      group: "Main library",
      dependencies: configItems => ["react", "react-dom"],
      devDependencies: configItems => {
        const isTypescript = _.includes(configItems, "Typescript");
        const isBabel = _.includes(configItems, "Babel");
        return _.concat(
          [],
          isTypescript ? ["@types/react", "@types/react-dom"] : [],
          isBabel ? ["@babel/preset-react"] : []
        );
      },
      files: configItems => {
        const isTypescript = _.includes(configItems, "Typescript");
        const isHotReact = _.includes(configItems, "React hot loader");
        const extraImports = getStyleImports(configItems);

        if (isTypescript) {
          return {
            "src/App.tsx": reactAppTsx(configItems),
            "src/index.tsx": reactIndexTsx(extraImports, isHotReact)
          };
        }

        return {
          "src/App.js": reactAppJs(configItems),
          "src/index.js": reactIndexJs(extraImports)
        };
      }
    },
    Svelte: {
      group: "Main library",
      devDependencies: configItems => [
        "svelte",
        "svelte-loader",
        "svelte-preprocess"
      ],
      webpack: (webpackConfig, configItems) => {
        const isPostCSS = _.includes(configItems, "PostCSS");
        const webpackConfigWithRule = assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: /\.svelte$/,
              loader: "svelte-loader",
              options: {
                preprocess: `CODE: require('svelte-preprocess')({${
                  isPostCSS ? ` postcss: true ` : ""
                }})`
              }
            }
          ],
          [".mjs", ".js", ".svelte"]
        );
        return webpackConfigWithRule;
      },
      files: configItems => {
        const styling = getStyleTags(configItems);
        return {
          "src/index.js": svelteIndexJs(),
          "src/App.svelte": svelteAppSvelte(
            _.join(styling, "\n\n"),
            configItems
          )
        };
      }
    },
    Vue: {
      group: "Main library",
      webpackImports: [
        "const VueLoaderPlugin = require('vue-loader/lib/plugin');"
      ],
      webpack: webpackConfig => {
        const webpackConfigWithRule = assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: /\.vue$/,
              loader: "vue-loader"
            }
          ],
          [".js", ".vue"]
        );
        return addPlugin(webpackConfigWithRule, "CODE:new VueLoaderPlugin()");
      },
      devDependencies: configItems => [
        "vue-loader",
        "vue-template-compiler",
        "babel-loader",
        "@babel/core",
        "@babel/preset-env"
      ],
      dependencies: configItems => ["vue"],
      files: configItems => {
        const isTypescript = _.includes(configItems, "Typescript");
        const indexFilename = isTypescript ? "src/index.ts" : "src/index.js";
        const styling = getStyleTags(configItems);

        return _.assign(
          {
            "src/App.vue": vueIndexAppVue(_.join(styling, "\n"), configItems),
            [indexFilename]: vueIndexTs()
          },
          isTypescript ? { "vue-shim.d.ts": vueShimType } : {}
        );
      }
    },
    Bootstrap: {
      group: "UI library",
      dependencies: configItems => ["bootstrap", "jquery", "popper.js"]
    },
    "Tailwind CSS": {
      group: "UI library",
      dependencies: configItems => ["tailwindcss"]
    },
    "Material-UI": {
      group: "UI library",
      dependencies: configItems => [
        "@material-ui/core",
        "fontsource-roboto",
        "@material-ui/icons"
      ]
    },
    Jest: unitTestsRules.Jest,
    Mocha: unitTestsRules.Mocha,
    Jasmine: unitTestsRules.Jasmine,
    AVA: unitTestsRules.AVA,
    Cypress: unitTestsRules.Cypress,
    TestCafe: unitTestsRules.TestCafe,
    Babel: {
      group: "Transpiler",
      babel: (babelConfig, configItems) => ({
        ...babelConfig,
        presets: _.concat(
          [["@babel/preset-env", { modules: false }]],
          _.includes(configItems, "React") ? "@babel/preset-react" : []
        )
      }),
      devDependencies: configItems => {
        const devDepList = ["babel-loader", "@babel/core", "@babel/preset-env"];
        if (_.includes(configItems, "React hot loader"))
          devDepList.push("@hot-loader/react-dom");
        return devDepList;
      },
      webpack: (webpackConfig, configItems) =>
        assignModuleRuleAndResolver(
          webpackConfig,
          [
            {
              test: _.includes(configItems, "React") ? /\.(js|jsx)$/ : /\.js$/,
              use: "babel-loader",
              exclude: /node_modules/
            }
          ],
          _.includes(configItems, "React") ? [".js", ".jsx"] : null,
          _.includes(configItems, "React hot loader")
            ? { "react-dom": "@hot-loader/react-dom" }
            : {}
        )
    },
    Typescript: {
      group: "Transpiler",
      devDependencies: configItems => {
        const devDepList = ["typescript", "ts-loader"];
        if (_.includes(configItems, "React hot loader"))
          devDepList.push("@hot-loader/react-dom");
        return devDepList;
      },
      webpack: (webpackConfig, configItems) => {
        const isVue = _.includes(configItems, "Vue");
        const typescriptModule = {
          test: /\.ts(x)?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        };
        if (isVue) {
          typescriptModule.options = {
            appendTsSuffixTo: [/\.vue$/]
          };
        }
        const aliases = {};
        const isHot = _.includes(configItems, "React hot loader");
        if (isHot) {
          aliases["react-dom"] = "@hot-loader/react-dom";
        }
        return assignModuleRuleAndResolver(
          webpackConfig,
          typescriptModule,
          [".tsx", ".ts", ".js"],
          aliases
        );
      },
      files: configItems => {
        const isReact = _.includes(configItems, "React");
        const isVue = _.includes(configItems, "Vue");

        const configFiles = isReact
          ? { "tsconfig.json": tsconfigReact }
          : { "tsconfig.json": tsconfig };
        const sourceFiles =
          !isReact && !isVue
            ? {
                "src/index.ts": emptyIndexJs()
              }
            : {};
        return _.assign(configFiles, sourceFiles);
      }
    },
    CSS: stylingRules.css,
    "CSS Modules": stylingRules.cssModules,
    PostCSS: stylingRules.postCss,
    Sass: stylingRules.sass,
    Less: stylingRules.less,
    stylus: stylingRules.stylus,
    SVG: {
      group: "Image",
      devDependencies: configItems => ["file-loader"],
      webpack: webpackConfig =>
        addModuleRule(webpackConfig, {
          test: /\.svg$/,
          use: "file-loader"
        })
    },
    PNG: {
      group: "Image",
      devDependencies: configItems => ["url-loader"],
      webpack: webpackConfig =>
        addModuleRule(webpackConfig, {
          test: /\.png$/,
          use: [
            {
              loader: "url-loader",
              options: {
                mimetype: "image/png"
              }
            }
          ]
        })
    },
    moment: {
      group: "Utilities",
      dependencies: configItems => ["moment"],
      webpack: webpackConfig =>
        addPlugin(
          webpackConfig,
          "CODE:new webpack.ContextReplacementPlugin(/moment[\\/\\\\]locale$/, /en/)"
        ) // eslint-disable-line
    },
    lodash: {
      group: "Utilities",
      babel: _.identity,
      dependencies: configItems => ["lodash"],
      devDependencies: configItems => ["lodash-webpack-plugin"],
      webpackImports: [
        "const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');"
      ],
      webpack: webpackConfig =>
        addPlugin(webpackConfig, "CODE:new LodashModuleReplacementPlugin")
    },
    ESLint: lintingRules.eslint,
    Prettier: lintingRules.prettier,
    "Code split vendors": {
      group: "Optimization",
      webpack: webpackConfig => {
        const withFilename = _.setWith(
          webpackConfig,
          "output.filename",
          "[name].[contenthash].js",
          _.clone
        );
        return _.setWith(
          _.clone(withFilename),
          "optimization",
          {
            runtimeChunk: "single",
            splitChunks: {
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "vendors",
                  chunks: "all"
                }
              }
            }
          },
          _.clone
        );
      }
    },
    "HTML webpack plugin": {
      group: "Webpack plugins",
      devDependencies: configItems => ["html-webpack-plugin"],
      webpackImports: [
        "const HtmlWebpackPlugin = require('html-webpack-plugin');"
      ],
      webpack: webpackConfig => {
        return addPlugin(
          webpackConfig,
          `CODE:new HtmlWebpackPlugin({
  appMountId: 'app',
  filename: 'index.html'
})`
        );
      }
    },
    "Webpack Bundle Analyzer": {
      group: "Webpack plugins",
      devDependencies: configItems => ["webpack-bundle-analyzer"],
      webpackImports: [
        "const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;"
      ],
      webpack: webpackConfig => {
        return addPlugin(
          webpackConfig,
          `CODE:new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false,
})`
        );
      }
    },
    MiniCssExtractPlugin: {
      group: "Webpack plugins",
      devDependencies: configItems => ["mini-css-extract-plugin"],
      webpackImports: [
        "const MiniCssExtractPlugin = require('mini-css-extract-plugin');"
      ],
      webpack: webpackConfig => {
        return addPlugin(webpackConfig, `CODE:new MiniCssExtractPlugin()`);
      }
    },
    CopyWebpackPlugin: {
      group: "Webpack plugins",
      devDependencies: configItems => ["copy-webpack-plugin"],
      webpackImports: ["const CopyPlugin = require('copy-webpack-plugin');"],
      webpack: webpackConfig => {
        return addPlugin(
          webpackConfig,
          `CODE:new CopyPlugin([
  { from: 'src/index.html' }
])`
        );
      }
    },
    CleanWebpackPlugin: {
      group: "Webpack plugins",
      devDependencies: configItems => ["clean-webpack-plugin"],
      webpackImports: [
        `const { CleanWebpackPlugin } = require('clean-webpack-plugin');`
      ],
      webpack: webpackConfig => {
        return addPlugin(webpackConfig, `CODE:new CleanWebpackPlugin()`);
      }
    },
    "React hot loader": {
      group: "React",
      babel: (babelConfig, configItems) => {
        if (!_.includes(configItems, "Babel")) return {}; // We don't need babelrc for typescript
        return { ...babelConfig, plugins: ["react-hot-loader/babel"] };
      },
      dependencies: configItems => ["react-hot-loader"],
      devDependencies: configItems => ["webpack-dev-server"],
      webpack: webpackConfig => ({
        ...webpackConfig,
        devServer: {
          contentBase: "./dist"
        }
      }),
      packageJson: {
        scripts: {
          start: "webpack-dev-server --hot --mode development"
        }
      }
    }
  };
  const featuresNoNulls = _.mapValues(features, item => {
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
          "build-dev": "webpack -d --mode development",
          "build-prod": "webpack -p --mode production"
        }
      },
      devDependencies: ["webpack", "webpack-cli"],
      files: configItems => {
        const isTypescript = _.includes(configItems, "Typescript");
        const isCopyPlugin = _.includes(configItems, "CopyWebpackPlugin");

        const isHTMLWebpackPlugin = _.includes(
          configItems,
          "HTML webpack plugin"
        );
        const isMiniCssExtractPlugin = _.includes(
          configItems,
          "MiniCssExtractPlugin"
        );

        const files = {};

        if (!isTypescript) {
          files["src/index.js"] = emptyIndexJs(getStyleImports(configItems));
        }

        if (!isHTMLWebpackPlugin) {
          const distPath = isCopyPlugin ? "src/index.html" : "dist/index.html";
          files[distPath] = indexHtml({
            bundleFilename: "bundle.js",
            cssFilename: isMiniCssExtractPlugin ? "main.css" : null
          });
        }

        return files;
      }
    }
  };
})();
