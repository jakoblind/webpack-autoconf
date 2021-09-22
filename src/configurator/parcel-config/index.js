import _ from 'lodash';

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
      devDependencies: configItems => {
        const isTypescript = _.includes(configItems, 'typescript');
        return _.concat(
          [],
          isTypescript ? ['@types/react', '@types/react-dom'] : []
        );
      },
      files: configItems => {
        const isTypescript = _.includes(configItems, 'typescript');
        const extraImports = getStyleImports(configItems);

        if (isTypescript) {
          return {
            'src/index.tsx': reactIndexTsx(extraImports),
            'src/App.tsx': reactAppTsx(configItems),
            'src/index.html': indexHtml({ bundleFilename: 'index.tsx' }),
          };
        }

        return {
          'src/index.js': reactIndexJs(extraImports),
          'src/App.js': reactAppJs(configItems),
          'src/index.html': indexHtml({ bundleFilename: 'index.js' }),
        };
      },
    },
    vue: {
      name: 'Vue',
      group: 'Main library',
      dependencies: configItems => ['vue'],
      files: configItems => {
        const isTypescript = _.includes(configItems, 'typescript');
        const indexExtension = isTypescript ? 'ts' : 'js';
        const isCss = _.includes(configItems, 'css');
        const isLess = _.includes(configItems, 'less');
        const isSass = _.includes(configItems, 'sass');
        const isStylus = _.includes(configItems, 'stylus');
        const isTailwindCSS = _.includes(configItems, 'tailwind-css');
        const cssStyle = `<style>
${css}
</style>`;
        const lessStyle = `<style lang="less">
${less}
</style>`;
        const sassStyle = `<style lang="scss">
${scss}
</style>`;
        const stylusStyle = `<style lang="styl">
${stylus}
</style>`;
        const tailwindcssStyle = `<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>`;
        const styling = _.concat(
          [],
          isCss && !isTailwindCSS ? cssStyle : [],
          isSass ? sassStyle : [],
          isLess ? lessStyle : [],
          isStylus ? stylusStyle : [],
          isTailwindCSS ? tailwindcssStyle : []
        );

        return _.assign(
          {
            'src/App.vue': vueIndexAppVue(_.join(styling, '\n'), configItems),
            'src/index.html': indexHtml({
              bundleFilename: `index.${indexExtension}`,
            }),
            [`src/index.${indexExtension}`]: vueIndexTs(),
          },
          isTypescript ? { 'vue-shim.d.ts': vueShimType } : {}
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
    'material-ui': {
      name: 'Material UI',
      group: 'UI library',
      dependencies: configItems => [
        '@material-ui/core',
        'fontsource-roboto',
        '@material-ui/icons',
      ],
    },
    jest: unitTestsRules.jest,
    mocha: unitTestsRules.mocha,
    chai: unitTestsRules.chai,
    jasmine: unitTestsRules.jasmine,
    ava: unitTestsRules.ava,
    cypress: unitTestsRules.cypress,
    testcafe: unitTestsRules.testcafe,
    babel: {
      name: 'Babel',
      group: 'Transpiler',
      babel: (babelConfig, configItems) => ({
        ...babelConfig,
        presets: _.concat(
          [['@babel/preset-env', { modules: false }]],
          _.includes(configItems, 'react') ? '@babel/preset-react' : []
        ),
      }),
      devDependencies: configItems =>
        _.concat(
          ['@babel/core', '@babel/preset-env'],
          _.includes(configItems, 'react') ? '@babel/preset-react' : []
        ),
    },
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
                'src/index.html': indexHtml({ bundleFilename: 'index.ts' }),
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
        return {
          'src/styles.css': isTailwindcss
            ? tailwindcss({ withPostCSS: true })
            : css,
        };
      },
    },
    postcss: {
      name: 'PostCSS',
      group: 'Styling',
      devDependencies: configItems => ['postcss-modules', 'autoprefixer'],
      files: configItems => {
        const isTailwindcss = _.includes(configItems, 'tailwind-css');
        return { 'postcss.config.js': postCssConfig(isTailwindcss) };
      },
    },
    sass: {
      name: 'Sass',
      group: 'Styling',
      // devDependencies: configItems => ['sass'],//ToDO is thiss needed?
      files: configItems => ({ 'src/styles.scss': scss }),
    },
    less: {
      name: 'Less',
      group: 'Styling',
      files: configItems => ({ 'src/styles.less': less }),
    },
    stylus: {
      name: 'stylus',
      group: 'Styling',
      files: configItems => ({ 'src/styles.styl': stylus }),
    },
    eslint: lintingRules.eslint,
    prettier: lintingRules.prettier,
  };
  const featuresNoNulls = _.mapValues(features, item => {
    if (!item.babel) {
      item.babel = _.identity;
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
          start: 'parcel src/index.html',
          'build-prod': 'parcel build src/index.html',
        },
      },
      devDependencies: ['parcel-bundler'],
      files: configItems => {
        const isReact = _.includes(configItems, 'react');
        const isTypescript = _.includes(configItems, 'typescript');
        const isVue = _.includes(configItems, 'vue');
        if (!isReact && !isTypescript && !isVue) {
          return {
            'src/index.js': emptyIndexJs(getStyleImports(configItems)),
            'src/index.html': indexHtml({ bundleFilename: 'index.js' }),
          };
        }
        return [];
      },
    },
  };
})();
