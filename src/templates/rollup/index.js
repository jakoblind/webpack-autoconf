import _ from 'lodash';

export const getReadMeFile = (name, features) => {
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
  const output = [];
  const plugins = [];
  if (isBabel) {
    imports.push(`import babel from "rollup-plugin-babel";`);
    plugins.push(`babel({
      exclude: "node_modules/**"
    })`);
  }
  const resolveExtensions = ['.json'];
  if (isReact) {
    if (isTypescript) resolveExtensions.push('.ts', '.tsx');
    else resolveExtensions.push('.js', '.jsx');
  } else if (isTypescript) {
    resolveExtensions.push('.ts');
  } else {
    resolveExtensions.push('.js');
  }
  plugins.push(`resolve({
      extensions:${JSON.stringify(resolveExtensions)}
    }`);

  if (isReact) {
    imports.push(
      `import globals from 'rollup-plugin-node-globals';`,
      `import builtins from 'rollup-plugin-node-builtins';`
    );
    if (isTypescript) {
      plugins.push(`commonjs({
      include: "node_modules/**",
      namedExports: {
        "node_modules/react/index.js": [
          "Component",
          "PureComponent",
          "Fragment",
          "Children",
          "createElement"
        ],
        "node_modules/react-dom/index.js": ["render"]
      }
    })`);
    } else {
      plugins.push(
        `commonjs({
        exclude: 'src/**',
      })`
      );
    }

    plugins.push(`globals()`);
  } else {
    plugins.push('commonjs()');
  }

  if (isTypescript) {
    imports.push(`import typescript from 'rollup-plugin-typescript2';`);
    plugins.push(`typescript()`);
  }
  return `${imports.join('\n')}
  
export default {
  input: 'src/index.${extension}',
  output: {
    name:'index',
    file: 'dist/bundle.js',
    format: 'iife', 
    sourcemap: true
  },
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
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Button from './button';

class App extends React.Component<{}, {}> {
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
