import _ from 'lodash';

import { config } from 'bluebird';
import {
  css,
  scss,
  less,
  stylus,
  postCssConfig,
  tailwindcss,
} from '../../templates/styling';
import {
  reactIndexJs,
  reactAppJs,
  reactIndexTsx,
  reactAppTsx,
} from '../../templates/react/index';
import { indexHtml } from '../../templates/base';
import { emptyIndexJs } from '../../templates/empty/index';
import { tsconfig, tsconfigReact } from '../../templates/ts';
import { vueIndexAppVue, vueIndexTs, vueShimType } from '../../templates/vue';

import lintingRules from '../common-config/linting';
import unitTestsRules from '../common-config/unitTests';

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, 'CSS');
  const isSass = _.includes(configItems, 'Sass');
  const isLess = _.includes(configItems, 'Less');
  const isStylus = _.includes(configItems, 'stylus');
  return _.concat(
    [],
    isCss ? [`import "./styles.css";`] : [],
    isSass ? [`import "./styles.scss";`] : [],
    isLess ? [`import "./styles.less";`] : [],
    isStylus ? [`import "./styles.styl";`] : []
  );
}

function addSnowpackPlugin(snowpackConfig, plugin) {
  if (!snowpackConfig || !snowpackConfig.plugins) {
    return {
      ...snowpackConfig,
      plugins: [plugin],
    };
  }

  return {
    ...snowpackConfig,
    plugins: _.union(snowpackConfig.plugins, [plugin]),
  };
}

export default (() => {
  const features = {
    'No library': {
      group: 'Main library',
      snowpack: () => ({
        mount: {
          dist: '/',
          src: '/',
        },
        devOptions: {
          open: 'none',
        },
      }),
    },
    React: {
      group: 'Main library',
      dependencies: configItems => ['react', 'react-dom'],
      snowpack: (config = {}) => ({
        ...config,
        mount: {
          dist: '/',
          src: '/',
        },
        devOptions: {
          open: 'none',
        },
      }),
      files: configItems => {
        const extraImports = getStyleImports(configItems);

        return {
          'src/index.jsx': reactIndexJs(extraImports),
          'src/App.jsx': reactAppJs(configItems),
          'src/index.html': indexHtml({
            bundleFilename: 'index.js',
            isModule: true,
          }),
        };
      },
    },
    Bootstrap: {
      group: 'UI library',
      dependencies: configItems => ['bootstrap', 'jquery', 'popper.js'],
    },
    'Tailwind CSS': {
      group: 'UI library',
      dependencies: configItems => ['tailwindcss'],
    },
    Jest: unitTestsRules.Jest,
    Mocha: unitTestsRules.Mocha,
    Chai: unitTestsRules.Chai,
    Jasmine: unitTestsRules.Jasmine,
    AVA: unitTestsRules.AVA,
    Cypress: unitTestsRules.Cypress,
    TestCafe: unitTestsRules.TestCafe,
    CSS: {
      group: 'Styling',
      files: configItems => {
        const isTailwindcss = _.includes(configItems, 'Tailwind CSS');
        const isPostCSS = _.includes(configItems, 'PostCSS');
        return {
          'src/styles.css': isTailwindcss
            ? tailwindcss({ withPostCSS: isPostCSS })
            : css,
        };
      },
    },
    PostCSS: {
      group: 'Styling',
      devDependencies: configItems => [
        'postcss-cli',
        'postcss',
        'autoprefixer',
      ],
      files: configItems => {
        const isTailwindcss = _.includes(configItems, 'Tailwind CSS');
        return { 'postcss.config.js': postCssConfig(isTailwindcss) };
      },
      snowpack: (config = {}) =>
        addSnowpackPlugin(config, [
          '@snowpack/plugin-build-script',
          { cmd: 'postcss', input: ['.css'], output: ['.css'] },
        ]),
    },
    Sass: {
      group: 'Styling',
      devDependencies: configItems => ['@snowpack/plugin-sass'],
      files: configItems => {
        return { 'src/styles.scss': scss };
      },
      snowpack: (config = {}) =>
        addSnowpackPlugin(config, '@snowpack/plugin-sass'),
    },
    ESLint: lintingRules.eslint,
    Prettier: lintingRules.prettier,
  };
  const featuresNoNulls = _.mapValues(features, item => {
    if (!item.snowpack) {
      item.snowpack = _.identity;
    }
    if (!item.dependencies) {
      item.dependencies = () => [];
    }
    if (!item.devDependencies) {
      item.devDependencies = () => [];
    }
    if (!item.packageJson) {
      item.packageJson = {};
    }
    if (!item.files) {
      item.files = () => {};
    }

    return item;
  });
  return {
    features: featuresNoNulls,
    base: {
      packageJson: {
        scripts: {
          start: 'snowpack dev',
          build: 'snowpack build',
        },
      },
      devDependencies: ['snowpack'],
      files: configItems => {
        const isReact = _.includes(configItems, 'React');
        if (!isReact) {
          return {
            'src/index.js': emptyIndexJs(getStyleImports(configItems)),
            'src/index.html': indexHtml({
              bundleFilename: 'index.js',
              isModule: true,
            }),
          };
        }
        return [];
      },
    },
  };
})();
