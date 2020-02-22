import _ from 'lodash';

import { readmeFile, readmeFileParcel, gitignore } from '../templates/base';

import {
  createWebpackConfig,
  createBabelConfig,
  getDefaultProjectName,
  getPackageJson,
  createAdditionalFilesMap,
} from './configurator';

import { parcelConfig, webpackConfig } from './configurator-config';
import rollupConfig from './rollup-config';
import { getReadMeFile, getRollupConfig } from '../templates/rollup';

/*
  this function will call an external API to get version for node
  dependencies. therefore its a good idea to memoize it.
  if getNodeVersionPromise is null, no external api calls is made
  and the data is returned instead of in a promise

*/
const generateProject = (features, name, getNodeVersionPromise) => {
  const isBabel = _.includes(features, 'Babel');
  const isReact = _.includes(features, 'React');
  const isHotReact = _.includes(features, 'React hot loader');
  const additionalFilesMap = createAdditionalFilesMap(webpackConfig, features);
  const newWebpackConfig = createWebpackConfig(features);
  const newBabelConfig = createBabelConfig(features);
  const projectName = name || getDefaultProjectName('empty-project', features);
  const maybeConfigBabel =
    newBabelConfig && (isReact || isBabel)
      ? { '.babelrc': newBabelConfig }
      : null;

  const fileMap = _.assign(
    {},
    {
      'webpack.config.js': newWebpackConfig,
      'README.md': readmeFile(projectName, isReact, isHotReact),
      '.gitignore': gitignore(),
      'package.json': 'empty package.json',
    },
    additionalFilesMap,
    maybeConfigBabel
  );

  if (getNodeVersionPromise) {
    return getPackageJson(
      webpackConfig,
      projectName,
      getNodeVersionPromise,
      features
    ).then(packageJson => {
      fileMap['package.json'] = JSON.stringify(packageJson, null, 2);
      return fileMap;
    });
  }
  return fileMap;
};

export function generateParcelProject(features, name, getNodeVersionPromise) {
  const isBabel = _.includes(features, 'Babel');
  const isReact = _.includes(features, 'React');
  const isTypescript = _.includes(features, 'Typescript');
  const newBabelConfig = createBabelConfig(features);
  const additionalFilesMap = createAdditionalFilesMap(parcelConfig, features);
  const projectName = name || getDefaultProjectName('empty-project', features);
  const maybeConfigBabel =
    newBabelConfig && (isReact || isBabel)
      ? { '.babelrc': newBabelConfig }
      : null;

  const fileMap = _.assign(
    {},
    {
      'README.md': readmeFileParcel(projectName, isReact, false),
      '.gitignore': gitignore(),
    },
    maybeConfigBabel,
    additionalFilesMap
  );

  // TODO there is some duplicated code here. sorry
  if (getNodeVersionPromise) {
    return getPackageJson(
      parcelConfig,
      projectName,
      getNodeVersionPromise,
      features
    ).then(packageJson => {
      fileMap['package.json'] = JSON.stringify(packageJson, null, 2);
      return fileMap;
    });
  }
  return fileMap;
}

export function generateRollupProject(features, name, getNodeVersionPromise) {
  // console.log('heree');
  const additionalFilesMap = createAdditionalFilesMap(rollupConfig, features);
  const newBabelConfig = createBabelConfig(features);
  const projectName = name || getDefaultProjectName('empty-project', features);

  const maybeConfigBabel = newBabelConfig
    ? { '.babelrc': newBabelConfig }
    : null;

  const fileMap = _.assign(
    {},
    {
      'rollup.config.js': getRollupConfig(features),
      'README.md': getReadMeFile(name, features),
      'package.json': 'empty package.json',
    },
    additionalFilesMap,
    maybeConfigBabel
  );

  if (getNodeVersionPromise) {
    return getPackageJson(
      rollupConfig,
      name,
      getNodeVersionPromise,
      features
    ).then(packageJson => {
      const isReact = _.includes(features, 'React');
      const isTypescript = _.includes(features, 'Typescript');
      if (isReact && isTypescript) {
        packageJson.module = 'dist/index.es.js';
        packageJson.main = 'dist/index.js';
        packageJson.peerDependencies = packageJson.dependencies;
        delete packageJson.dependencies;
      }

      fileMap['package.json'] = JSON.stringify(packageJson, null, 2);
      return fileMap;
    });
  }
  return fileMap;
}

export default generateProject;
