import _ from 'lodash';

export const baseWebpack = {
  entry: './src/index.js',
  output: {
    path: "CODE:path.resolve(__dirname, 'dist')",
    filename: 'bundle.js',
  },
};

export const baseSnowpackConfig = {
  mount: {
    dist: '/',
    src: '/',
  },
};

export const baseWebpackImports = [
  "const webpack = require('webpack');",
  "const path = require('path');",
];

export const packageJson = {
  version: '1.0.0',
  description: '',
  main: 'index.js',
  keywords: [],
  author: '',
  license: 'ISC',
  scripts: {
    clean: 'rm dist/bundle.js',
  },
};

export const indexHtml = ({
  bundleFilename = 'bundle.js',
  cssFilename,
  isModule = false,
}) => `<!DOCTYPE html>
<html>
    <head>
        <title>Empty project</title>
        <meta charset="utf-8">${
          cssFilename
            ? `\n        <link href="main.css" rel="stylesheet" />`
            : ``
        }
    </head>
    <body>
        <div id="app"></div>
        <script${
          isModule ? ` type="module"` : ``
        } src="${bundleFilename}"></script>
    </body>
</html>`;

export const readmeFile = (name, features) => {
  const isReact = _.includes(features, 'React');
  const isTestFrameworkRunWithTest = !_.isEmpty(
    _.intersection(features, ['AVA', 'Mocha', 'Jest', 'Jasmine', 'TestCafe'])
  );
  const isCypress = _.includes(features, 'Cypress');

  const isHot = _.includes(features, 'React hot loader');
  return `# ${name}

Empty project.

## Building and running on localhost

First install dependencies:

\`\`\`sh
npm install
\`\`\`
${
  isHot
    ? `
To run in hot module reloading mode:

\`\`\`sh
npm start
\`\`\`
`
    : ``
}
To create a production build:

\`\`\`sh
npm run build-prod
\`\`\`

To create a development build:

\`\`\`sh
npm run build-dev
\`\`\`

## Running

${
  isReact
    ? 'Open the file `dist/index.html` in your browser'
    : '```sh\nnode dist/bundle.js\n```'
}${
    isTestFrameworkRunWithTest || isCypress
      ? `

## Testing`
      : ''
  }${
    isTestFrameworkRunWithTest
      ? `

To run unit tests:

\`\`\`sh
npm test
\`\`\``
      : ''
  }
${
  isCypress
    ? `
To run cypress:

\`\`\`sh
npm cypress:open
\`\`\`
`
    : ''
}
## Credits

Made with [createapp.dev](https://createapp.dev/)
`;
};

export const readmeFileParcel = (name, features) => {
  const isReact = _.includes(features, 'React');
  const isTestFrameworkRunWithTest = !_.isEmpty(
    _.intersection(features, ['AVA', 'Mocha', 'Jest', 'Jasmine', 'TestCafe'])
  );
  const isCypress = _.includes(features, 'Cypress');
  return `# ${name}

Empty project.

## Building and running on localhost

First install dependencies:

\`\`\`sh
npm install
\`\`\`

To run in hot module reloading mode:

\`\`\`sh
npm start
\`\`\`

To create a production build:

\`\`\`sh
npm run build-prod
\`\`\`

## Running

${
  isReact
    ? 'Open the file `dist/index.html` in your browser'
    : '```sh\nnode dist/bundle.js\n```'
}${
    isTestFrameworkRunWithTest || isCypress
      ? `

## Testing`
      : ''
  }${
    isTestFrameworkRunWithTest
      ? `

To run unit tests:

\`\`\`sh
npm test
\`\`\``
      : ''
  }
${
  isCypress
    ? `
To run cypress:

\`\`\`sh
npm cypress:open
\`\`\`
`
    : ''
}
## Credits

Made with [createapp.dev](https://createapp.dev/)

`;
};

export const readmeFileSnowpack = (name, features) => {
  const isReact = _.includes(features, 'React');
  const isTestFrameworkRunWithTest = !_.isEmpty(
    _.intersection(features, ['AVA', 'Mocha', 'Jest', 'Jasmine', 'TestCafe'])
  );
  const isCypress = _.includes(features, 'Cypress');
  return `# ${name}

Empty project.

## How to run on localhost

First install dependencies:

\`\`\`sh
npm install
\`\`\`

To run in dev mode mode:

\`\`\`sh
npm start
\`\`\`

Then go to http://localhost:8080

To create a production build:

\`\`\`sh
npm run build
\`\`\`${
    isTestFrameworkRunWithTest || isCypress
      ? `

## Testing`
      : ''
  }${
    isTestFrameworkRunWithTest
      ? `

To run unit tests:

\`\`\`sh
npm test
\`\`\``
      : ''
  }
${
  isCypress
    ? `
To run cypress:

\`\`\`sh
npm cypress:open
\`\`\`
`
    : ''
}
## Credits

Made with [createapp.dev](https://createapp.dev/)

`;
};

export const gitignore = () => `
.cache/
coverage/
dist/*
!dist/index.html
node_modules/
*.log

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`;
