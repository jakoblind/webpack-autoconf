import { baseWebpack, baseWebpackImports } from "./templates";

const jsStringify = require("javascript-stringify");
const _ = require("lodash");

function addPlugin(webpackConfig, plugin) {
    if (!webpackConfig.plugins) {
        return Object.assign({}, webpackConfig, {
            plugins: [plugin]
        })
    }
    return Object.assign({}, webpackConfig, {
        plugins: _.concat(webpackConfig.plugins, plugin)
    })
}

function addModuleRule(webpackConfig, rule) {
    if (!_.has(webpackConfig, "module.rules")) {
        return Object.assign({}, webpackConfig, {
            module: {
                rules: [rule]
            }
        })
    }

    const newWebpackConfig = _.cloneDeep(webpackConfig);
    newWebpackConfig.module.rules.push(rule);
    return newWebpackConfig;
}

export const features = (()=>{
    const features = {
        "React": {
            group: "Main library",
            babel: (babelConfig) => Object.assign({}, babelConfig, {
                "presets": [['env', { modules: false }], "react"]
            }),
            dependencies: ["react", "react-dom"],
            devDependencies: ["babel-loader", "babel-preset-react", "babel-core", "babel-preset-env"],
            webpack: (webpackConfig) =>
                Object.assign({}, webpackConfig, addModuleRule(webpackConfig, {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }), {
                    resolve: {
                        extensions: ['.js', '.jsx']
                    }
                })
        },
        "Vue": {
            group: "Main library",
            webpackImports: ["const VueLoaderPlugin = require('vue-loader/lib/plugin');"],
            webpack: (webpackConfig) => {
                const webpackConfigWithRule = addModuleRule(webpackConfig,  {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                })

                return addPlugin(webpackConfigWithRule, "CODE:new VueLoaderPlugin()");
            },
            babel: (babelConfig) => Object.assign({}, babelConfig, {
                "presets": [['env', { modules: false }], "react"]
            }),
            devDependencies: ["vue-loader", "vue-template-compiler"],
            dependencies: ["vue"]
        },
        "CSS": {
            group: "Styling",
            devDependencies: ["style-loader", "css-loader"],
            webpack: (webpackConfig) => addModuleRule(webpackConfig, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            })
        },
        "Sass": {
            group: "Styling",
            devDependencies: ["style-loader", "css-loader", "sass-loader", "node-sass"],
            webpack: (webpackConfig) => addModuleRule(webpackConfig, {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            })
        },
        "Less": {
            group: "Styling",
            devDependencies: ["style-loader", "css-loader", "less-loader"],
            webpack: (webpackConfig) => addModuleRule(webpackConfig, {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            })
        },
        "stylus": {
            group: "Styling",
            devDependencies: ["style-loader", "css-loader", "stylus-loader"],
            webpack: (webpackConfig) => addModuleRule(webpackConfig, {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            })
        },
        "SVG": {
            group: "Image",
            devDependencies: ["file-loader"],
            webpack: (webpackConfig) => addModuleRule(webpackConfig, {
                test: /\.svg$/,
                use: [
                    "file-loader"
                ]
            })
        },
        "PNG": {
            group: "Image",
            devDependencies: ["url-loader"],
            webpack: (webpackConfig) => addModuleRule(webpackConfig, {
                test: /\.png$/,
                use: [{
                    loader: 'url-loader',
                    options:{
                        mimetype:'image/png'
                    }
                }]
            })
        },
        "moment": {
            group: "Utilities",
            "dependencies": ["moment"],
            webpack: (webpackConfig) => addPlugin(webpackConfig, "CODE:new webpack.ContextReplacementPlugin(/moment[\\\/\\\\]locale$/, /en/)")
        },
        "lodash": {
            group: "Utilities",
            babel: _.identity,
            dependencies: ["lodash"],
            devDependencies: ["lodash-webpack-plugin"],
            webpackImports: ["const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');"],
            webpack:
            (webpackConfig) => addPlugin(webpackConfig, "CODE:new LodashModuleReplacementPlugin")
        },
        "Production mode": {
            webpack: (webpackConfig) => Object.assign({}, webpackConfig, {"mode": "production"})
        }
    }
    return _.mapValues(features, (item) => {
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
            item.dependencies = [];
        }
        if (!item.devDependencies) {
            item.devDependencies = [];
        }
        return item;
    })
})()

function stringifyReplacer (value, indent, stringify) {
  if (typeof value === 'string' && value.startsWith("CODE:")) {
      return value.replace(/"/g, '\\"').replace(/^CODE:/, "");
  }

  return stringify(value);
}

function createConfig(configItems, configType) {
    const base = configType === "webpack" ? baseWebpack : {};
    return jsStringify(_.reduce(configItems, (acc, currentValue) => (features[currentValue][configType](acc)), base), stringifyReplacer, 2)
}

export function getNpmDependencies(configItems) {
    const dependencies = _.chain(configItems)
          .reduce((acc, currentValue) => (_.concat(acc, features[currentValue]["dependencies"])), [])
          .uniq()
          .value();

    const devDependencies = _.chain(configItems)
          .reduce((acc, currentValue) => (_.concat(acc, features[currentValue]["devDependencies"])), ["webpack"])
          .uniq()
          .value();

    return {
        dependencies,
        devDependencies
    }
}

export function getWebpackImports(configItems) {
    return _.reduce(configItems, (acc, currentValue) => (_.concat(acc, features[currentValue]["webpackImports"])), [])
}

export function createBabelConfig(configItems) {
    const config = createConfig(configItems, "babel");
    return config === "{}" ? null : config;

}

export function createWebpackConfig(configItems) {
    const imports = _.concat(baseWebpackImports, getWebpackImports(configItems))
    return `${imports.join("\n")}

const config = ${createConfig(configItems, "webpack")}

module.exports = config;`;
}
