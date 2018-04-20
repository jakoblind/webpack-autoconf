const jsStringify = require("javascript-stringify");
const _ = require("lodash");

export const baseWebpack = {
    entry: './src/index.js',
    output: {
        path: "path.resolve(__dirname, 'dist')",
        filename: 'bundle.js'
    }
}
export const features = {
    "Production mode": {
        babel: _.identity,
        webpack: _.identity,
        npm: []
    },
    "lodash": {
        babel: _.identity,
        npm: ["lodash"],
        webpack:
        (webpackConfig) =>
            Object.assign({}, webpackConfig, {
                lodash: true
            })
    },
    "React": {
        babel: (babelConfig) => Object.assign({}, babelConfig, {
  "presets": ["env", "react"]
        }),
        npm: ["react", "react-dom", "babel-loader", "babel-preset-react", "babel-core", "babel-preset-env"],
        webpack: (webpackConfig) =>
            Object.assign({}, webpackConfig, {
                module: {
                    rules: [
                        {
                            test: /\.(js|jsx)$/,
                            exclude: /node_modules/,
                            use: 'babel-loader'
                        }
                    ]
                }
            })
    }
}

export function getNpmModules(configItems) {
    return _.reduce(configItems, (acc, currentValue) => (_.concat(acc, features[currentValue]["npm"])), ["webpack"])
}

export function createConfig(configItems, configType) {
    const base = configType === "webpack" ? baseWebpack : {};
    return jsStringify(_.reduce(configItems, (acc, currentValue) => (features[currentValue][configType](acc)), base), null, 2)
}
