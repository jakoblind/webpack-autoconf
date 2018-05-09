export const baseWebpack = {
    entry: './src/index.js',
    output: {
        path: "CODE:path.resolve(__dirname, 'dist')",
        filename: 'bundle.js'
    },
    mode: 'development'
}

export const baseWebpackImports = [
    "const webpack = require('webpack');",
    "const path = require('path');"
];
