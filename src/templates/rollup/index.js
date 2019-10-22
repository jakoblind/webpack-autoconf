import _ from 'lodash';

export const getReadMeFile = (name, features) => {
  return `
## ${name}

Hello

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
    options.compilerOptions.lib.push('dom');
  }
  return JSON.stringify(options, null, 2);
};

export const getRollupConfig = features => {
  const isBabel = _.includes(features, 'Babel');
  const isTypescript = _.includes(features, 'Typescript');

  const extension = isTypescript ? 'ts' : 'js';

  const imports = [
    `import resolve from 'rollup-plugin-node-resolve';`,
    `import commonjs from 'rollup-plugin-commonjs';`,
  ];
  const output = [];
  const plugins = ['resolve()', 'commonjs()'];

  if (isBabel) {
    imports.push(`import babel from "rollup-plugin-babel";`);
    plugins.push(`babel({
      exclude: "node_modules/**"
    })`);
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
    ${plugins.join(', ')}
  ]
};
  
  `;
};
