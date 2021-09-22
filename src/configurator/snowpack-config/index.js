import _ from 'lodash';

import { config } from 'bluebird';
import {
  css,
  scss,
  less,
  stylus,
  postCssConfig,
  tailwindcss,
  getStyleTags,
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
import { svelteIndexJs, svelteAppSvelte } from '../../templates/svelte/index';

import lintingRules from '../common-config/linting';
import unitTestsRules from '../common-config/unitTests';

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, 'css');
  const isSass = _.includes(configItems, 'sass');
  const isLess = _.includes(configItems, 'less');
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
    'no-library': {
      name: 'No library',
      group: 'Main library',
    },
    react: {
      name: 'React',
      group: 'Main library',
      dependencies: configItems => ['react', 'react-dom'],
      files: configItems => {
        const isTypescript = _.includes(configItems, 'typescript');
        const extraImports = getStyleImports(configItems);

        if (isTypescript) {
          return {
            'src/index.tsx': reactIndexTsx(extraImports),
            'src/App.tsx': reactAppTsx(configItems),
            'src/index.html': indexHtml({
              bundleFilename: 'index.js',
              isModule: true,
            }),
          };
        }
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
    svelte: {
      name: 'Svelte',
      group: 'Main library',
      dependencies: configItems => [
        'svelte',
        'svelte-loader',
        'svelte-preprocess',
      ],
      devDependencies: configItems => {
        const isSass = _.includes(configItems, 'sass');
        return _.concat(
          ['@snowpack/plugin-svelte'],
          isSass ? ['svelte-preprocess'] : null
        );
      },
      snowpack: (config = {}) =>
        addSnowpackPlugin(config, '@snowpack/plugin-svelte'),
      files: configItems => {
        const styling = getStyleTags(configItems);
        const isSass = _.includes(configItems, 'sass');
        let svelteConf = null;
        if (isSass) {
          svelteConf = {
            'svelte.config.js': `module.exports = {
  preprocess: require('svelte-preprocess')()
}`,
          };
        }
        return _.assign(
          {
            'src/index.js': svelteIndexJs(),
            'src/App.svelte': svelteAppSvelte(
              _.join(styling, '\n\n'),
              configItems
            ),
          },
          svelteConf
        );
      },
    },
    bootstrap: {
      name: 'Bootstrap',
      group: 'UI library',
      dependencies: configItems => ['bootstrap', 'jquery', 'popper.js'],
    },
    'tailwind-css': {
      name: 'Tailwind CSS',
      group: 'UI library',
      dependencies: configItems => ['tailwindcss'],
    },
    jest: unitTestsRules.jest,
    mocha: unitTestsRules.mocha,
    chai: unitTestsRules.chai,
    jasmine: unitTestsRules.jasmine,
    ava: unitTestsRules.ava,
    cypress: unitTestsRules.cypress,
    testcafe: unitTestsRules.testcafe,

    typescript: {
      name: 'Typescript',
      group: 'Transpiler',
      files: configItems => {
        const isReact = _.includes(configItems, 'react');
        const isVue = _.includes(configItems, 'vue');

        const configFiles = isReact
          ? { 'tsconfig.json': tsconfigReact }
          : { 'tsconfig.json': tsconfig };
        const sourceFiles =
          !isReact && !isVue
            ? {
                'src/index.html': indexHtml({
                  bundleFilename: 'index.js',
                  isModule: true,
                }),
                'src/index.ts': emptyIndexJs(),
              }
            : {};
        return _.assign(configFiles, sourceFiles);
      },
    },
    css: {
      name: 'CSS',
      group: 'Styling',
      files: configItems => {
        const isTailwindcss = _.includes(configItems, 'tailwind-css');
        const isPostCSS = _.includes(configItems, 'postcss');
        const isVue = _.includes(configItems, 'vue');
        const isSvelte = _.includes(configItems, 'svelte');
        if (isVue || isSvelte) {
          return {};
        }
        return {
          'src/styles.css': isTailwindcss
            ? tailwindcss({ withPostCSS: isPostCSS })
            : css,
        };
      },
    },
    postcss: {
      name: 'PostCSS',
      group: 'Styling',
      devDependencies: configItems => [
        'postcss-cli',
        'postcss',
        'autoprefixer',
        '@snowpack/plugin-postcss',
      ],
      files: configItems => {
        const isTailwindcss = _.includes(configItems, 'tailwind-css');
        return { 'postcss.config.js': postCssConfig(isTailwindcss) };
      },
      snowpack: (config = {}) =>
        addSnowpackPlugin(config, ['@snowpack/plugin-postcss']),
    },
    sass: {
      name: 'Sass',
      group: 'Styling',
      devDependencies: configItems => ['@snowpack/plugin-sass'],
      files: configItems => {
        const isVue = _.includes(configItems, 'vue');
        const isSvelte = _.includes(configItems, 'svelte');
        if (isVue || isSvelte) {
          return {};
        }
        return { 'src/styles.scss': scss };
      },
      snowpack: (config = {}) =>
        addSnowpackPlugin(config, '@snowpack/plugin-sass'),
    },
    eslint: lintingRules.eslint,
    prettier: lintingRules.prettier,
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
        const isReact = _.includes(configItems, 'react');
        const isTypescript = _.includes(configItems, 'typescript');
        const isVue = _.includes(configItems, 'vue');
        if (!isReact && !isTypescript && !isVue) {
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
