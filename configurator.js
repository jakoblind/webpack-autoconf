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
        webpack:
        (webpackConfig) =>
            Object.assign({}, webpackConfig, {
                lodash: true
            })
    },
    "React": {
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

export function createConfig(configItems) {
    return jsStringify(_.reduce(configItems, (acc, currentValue) => (features[currentValue]["webpack"](acc)), baseWebpack), null, 2)
}

// console.log("it is ", createConfig(["React", "lodash"]));
