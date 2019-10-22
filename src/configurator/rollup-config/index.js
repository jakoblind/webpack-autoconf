import _ from 'lodash';
import {
  getIndex,
  getBasicTS,
  getTSJsonConfig,
  getReactIndexJSX,
  getIndexHTML,
  getButtonComponentJSX,
} from '../../templates/rollup';

export default (() => {
  const features = {
    React: {
      group: 'Main library',
      dependencies: configItems => {
        const depList = ['react', 'react-dom'];
        const isTypescript = _.includes(configItems, 'Typescript');
        if (isTypescript) {
          console.log();
        } else {
          depList.push('prop-types', 'react', 'react-dom');
        }

        return depList;
      },
      devDependencies: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript');
        return _.concat(
          [
            'npm-run-all',
            'browser-sync',
            'rollup-plugin-node-builtins',
            'rollup-plugin-node-globals',
          ],
          isTypescript
            ? ['@types/react', '@types/react-dom']
            : ['@babel/preset-react']
        );
      },
      packageJson: {
        scripts: {
          browse:
            'browser-sync start --s --ss dist --index dist/index.html --files dist/**/*.js --no-notify',
          start: 'npm-run-all --parallel watch browse',
        },
      },

      files: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript');
        const extraImports = [];

        if (isTypescript) {
          return {
            'src/index.tsx': 'ts app jsx',
            'src/index.html': 'html file ts',
          };
        }
        return {
          'src/button.jsx': getButtonComponentJSX(configItems),
          'src/index.js': getReactIndexJSX(configItems),
          'dist/index.html': getIndexHTML(configItems),
        };
      },
    },
    Babel: {
      group: 'Transpiler',
      // selected: true,
      dependencies: configItems => [],
      devDependencies: configItems => {
        const isReact = _.includes(configItems, 'React');
        const devDependencies = [
          '@babel/core',
          '@babel/preset-env',
          'rollup-plugin-babel',
        ];
        return devDependencies;
      },
      files: configItems => {
        const isReact = _.includes(configItems, 'React');

        if (!isReact) {
          return {
            'src/index.js': getIndex(configItems),
          };
        }
        return [];
      },
    },
    Typescript: {
      group: 'Transpiler',
      devDependencies: configItems => {
        const devDepList = ['typescript', 'rollup-plugin-typescript2'];

        return devDepList;
      },
      dependencies: () => [],

      files: configItems => {
        const isReact = _.includes(configItems, 'React');
        const isVue = _.includes(configItems, 'Vue');

        const configFiles = {};
        const sourceFiles = {
          'tsconfig.json': getTSJsonConfig(configItems),
        };
        return _.assign(configFiles, sourceFiles);
      },
    },
  };
  return {
    features,
    base: {
      packageJson: {
        scripts: {
          build: 'rollup -c',
          watch: 'rollup -c -w',
        },
      },
      devDependencies: [
        'rollup',
        'rollup-plugin-commonjs',
        'rollup-plugin-node-resolve',
      ],
      files: configItems => {
        const filesMap = {};
        const isReact = _.includes(configItems, 'React');
        if (isReact) return filesMap;
        if (_.includes(configItems, 'Typescript')) {
          filesMap['src/index.ts'] = getBasicTS(configItems);
        } else {
          filesMap['src/index.js'] = getIndex(configItems);
        }
        return filesMap;
      },
    },
  };
})();
