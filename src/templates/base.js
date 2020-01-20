export const baseWebpack = {
  entry: './src/index.js',
  output: {
    path: "CODE:path.resolve(__dirname, 'dist')",
    filename: 'bundle.js',
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

export const indexHtml = (bundleFilename = 'bundle.js') => `<!DOCTYPE html>
<html>
    <head>
        <title>Empty project</title>
        <meta charset="utf-8">
    </head>
    <body>
        <div id="app"></div>
        <script src="${bundleFilename}"></script>
    </body>
</html>`;

export const readmeFile = (name, isReact, isHot) => `# ${name}

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
}

## Credits

Made with [createapp.dev](https://createapp.dev/)
`;

export const readmeFileParcel = (name, isReact) => `# ${name}

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
}

## Credits

Made with [createapp.dev](https://createapp.dev/)

`;

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
