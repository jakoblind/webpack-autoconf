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
    "lodash": {
        npm: ["lodash"],
        webpack:
        (webpackConfig) =>
            Object.assign({}, webpackConfig, {
                lodash: true
            })
    },
    "React": {
        npm: ["react", "react-dom"],
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
    return _.reduce(configItems, (acc, currentValue) => (_.concat(acc, features[currentValue]["npm"])), [])
}

export function createConfig(configItems, configType) {
    return jsStringify(_.reduce(configItems, (acc, currentValue) => (features[currentValue][configType](acc)), baseWebpack), null, 2)
}

// console.log("it is ", createConfig(["React", "lodash"]));
