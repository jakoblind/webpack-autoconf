import _ from 'lodash';

export const getReadMeFile = (name, features) => {
  const isTypescript = _.includes(features, 'Typescript');
  const isReact = _.includes(features, 'React');
  return `
## ${name}

## Building and running on localhost

First install dependencies:

\`\`\`sh
npm install
\`\`\`

To create a development in watch mode:

\`\`\`sh
npm run watch
\`\`\`

${
  isReact && isTypescript
    ? `
To make library installable into other local folders, run 

\`\`\`npm link\`\`\`

Now go to you package consumer folder and run
\`\`\`npm link empty-project \`\`\`  # you can change this name in package.json and update here as well.

Please refer to \`\`\`npm link \`\`\` documentation for more information.
`
    : ``
}

To create a production build:

\`\`\`sh
npm run build
\`\`\`

## Credits

Made with [createapp.dev](https://createapp.dev/)

  `;
};

export const getIndex = configItems => {
  const isBabel = _.includes(configItems, 'Babel');

  return `// ES5 
var sayHi = function(name) {
  return "Hi, " + name;
};

${
  isBabel
    ? `// ES6
const sayHello = name => \`Hello, \${name}\`;`
    : ''
}

// Export
${
  isBabel
    ? `export default {
  sayHi, 
  sayHello
};`
    : `export default sayHi;`
}`;
};

export const getBasicTS = configItems => {
  return `
  const sayHello = (name:string): string => \`Hello, \${name}\`;

  export default sayHello;
  `;
};

export const getTSJsonConfig = configItems => {
  const options = {
    compilerOptions: {
      outDir: 'dist',
      module: 'esnext',
      target: 'es5',
      lib: ['es6', 'es2016', 'es2017'],
      sourceMap: true,
      declaration: true,
      moduleResolution: 'node',
    },
    include: ['src'],
    exclude: ['node_modules', 'dist', 'rollup.config.js'],
  };
  if (_.includes(configItems, 'React')) {
    options.compilerOptions.jsx = 'react';
    options.compilerOptions.lib.push('dom');
    options.compilerOptions.esModuleInterop = true;
    options.compilerOptions.allowSyntheticDefaultImports = true;
    options.compilerOptions.allowJs = false;
    options.compilerOptions.forceConsistentCasingInFileNames = true;
    options.compilerOptions.noImplicitReturns = true;
    options.compilerOptions.noImplicitThis = true;
    options.compilerOptions.noImplicitAny = true;
    options.compilerOptions.strictNullChecks = true;
    options.compilerOptions.suppressImplicitAnyIndexErrors = true;
    options.compilerOptions.noUnusedLocals = true;
    options.compilerOptions.noUnusedParameters = true;
  }
  return JSON.stringify(options, null, 2);
};

export const getRollupConfig = features => {
  const isBabel = _.includes(features, 'Babel');
  const isTypescript = _.includes(features, 'Typescript');
  const isReact = _.includes(features, 'React');

  const extension = isTypescript ? (isReact ? 'tsx' : 'ts') : 'js';

  const imports = [
    `import resolve from 'rollup-plugin-node-resolve';`,
    `import commonjs from 'rollup-plugin-commonjs';`,
  ];
  const plugins = [];
  const outputs = [];
  const resolveExtensions = ['.json'];
  if (isBabel) {
    resolveExtensions.push('.js');
    imports.push(`import babel from "rollup-plugin-babel";`);
    plugins.push(`babel({
      exclude: "node_modules/**"
    })`);
  }

  if (isTypescript) {
    resolveExtensions.push('.ts');
    imports.push(
      `import external from "rollup-plugin-peer-deps-external";`,
      `import typescript from "rollup-plugin-typescript2";`
    );
  }
  if (!isReact) {
    plugins.push('commonjs()');
    outputs.push(`{
      name:'index',
      file: 'dist/bundle.js',
      format: 'iife', 
      sourcemap: true
    }`);
    if (isTypescript) {
      plugins.push(
        `external()`,

        `resolve({
          extensions:${JSON.stringify(resolveExtensions)}
        })`,
        `  typescript({
        rollupCommonJSResolveHack: true,
        clean: true
      })`
      );
    }
    if (isBabel) {
      plugins.push(`resolve({
        extensions:${JSON.stringify(resolveExtensions)}
      })`);
    }
  }
  if (isReact) {
    if (isTypescript) {
      imports.push(`import pkg from "./package.json";`);
      resolveExtensions.push('.tsx');
      plugins.push(
        `external()`,
        `resolve({
          extensions:${JSON.stringify(resolveExtensions)}
        })`,
        `typescript({
        rollupCommonJSResolveHack: true,
        clean: true
      })`,
        `commonjs()`
      );
      outputs.push(
        `\t{
          file: pkg.main,
          format: "cjs",
          exports: "named",
          sourcemap: true
        }`,
        `\t\t{
          file: pkg.module,
          format: "es",
          exports: "named",
          sourcemap: true
        }`
      );
    } else {
      resolveExtensions.push('.jsx');
      imports.push(`import globals from 'rollup-plugin-node-globals';`);

      plugins.push(
        `resolve({
          extensions:${JSON.stringify(resolveExtensions)}
        })`,
        `commonjs({
        exclude: 'src/**',
      })`,
        `globals()`
      );
      outputs.push(`{
        name:'index',
        file: 'dist/bundle.js',
        format: 'iife', 
        sourcemap: true
      }`);
    }
  }

  return `${imports.join('\n')}

  
export default {
  input: 'src/index.${extension}',

  output: [
    ${outputs.join(',\n')}
  ],
  plugins: [
    ${plugins.join(',\n\t')}
  ]
};
  
  `;
};

export const getButtonComponentJSX = () => {
  return `

import React from 'react'
import PropTypes from 'prop-types'


class Button extends React.Component {
  render() {
    const { text } = this.props;
    return (
      <button>{text}</button>
    )
  }
}

Button.propTypes = {
  text: PropTypes.string.isRequired
}

export default Button;
  
  `;
};
export const getReactIndexJSX = configItems => {
  return `
import React from 'react';
import ReactDOM from 'react-dom';

import Button from './button.jsx';
  
class App extends React.Component {
  render() {
    return (
      <div>
        <Button text='Hello' />
      </div>
    )
  }
}
  
const root = document.querySelector('main');
ReactDOM.render(<App />, root);
`;
};

export const getReactIndexTSX = configItems => {
  return `
  export { default as Button } from "./button";
  `;
};

export const getButtonComponentTSX = configItems => {
  return `
import * as React from 'react'

export type Props = { text: string }

class Button extends React.Component<Props> {
  render() {
    const { text } = this.props

    return (
      <button>{text}</button>
    )
  }
}

export default Button;
    
  `;
};

export const getIndexHTML = configItems => {
  return `
<!doctype html>
<html>
<head lang='en'>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width'>
	<title>rollup-starter-app</title>
</head>
<body>
  <main>React App Loads here</main>
	<script src='bundle.js'></script>
</body>
</html>
  `;
};
