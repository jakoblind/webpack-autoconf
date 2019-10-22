import _ from 'lodash';
import { getIndex, getBasicTS, getTSJsonConfig } from '../../templates/rollup';

export default (() => {
  const features = {
    Babel: {
      group: 'Transpiler',
      // selected: true,
      dependencies: configItems => [],
      devDependencies: configItems => {
        return ['@babel/core', '@babel/preset-env', 'rollup-plugin-babel'];
      },
      files: configItems => {
        const isBabel = _.includes(configItems, 'Babel');

        if (isBabel) {
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
