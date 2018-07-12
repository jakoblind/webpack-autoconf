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

export const packageJson = {
  // "name": "empty-project-react-less-png-production-mode",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "scripts": {
    "dist": "webpack -p"
  },
  "devDependencies": {
//    "react": "^16.4.1",
  }
}

export const readmeFile = (name, isReact) => `# ${name}

Empty project.

## Installation and building

\`\`\`sh
npm install
npm run dist
\`\`\`

## Running

${isReact ? "Open the file `dist/index.html` in your browser" : "```sh\nnode dist/bundle.js\n```"}

`
