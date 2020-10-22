import _ from 'lodash';

import { readmeFile, readmeFileParcel, gitignore } from '../templates/base';

import {
  createWebpackConfig,
  createSnowpackConfig,
  createBabelConfig,
  getDefaultProjectName,
  getPackageJson,
  createAdditionalFilesMap,
} from './configurator';

import {
  parcelConfig,
  webpackConfig,
  snowpackConfig,
} from './configurator-config';

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
      'README.md': readmeFile(projectName, features),
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
      'README.md': readmeFileParcel(projectName, features),
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

export function generateSnowpackProject(features, name, getNodeVersionPromise) {
  const newSnowpackConfig = createSnowpackConfig(
    features,
    snowpackConfig.features
  );
  const additionalFilesMap = createAdditionalFilesMap(snowpackConfig, features);
  const projectName = name || getDefaultProjectName('empty-project', features);

  const fileMap = _.assign(
    {},
    {
      'snowpack.config.json': newSnowpackConfig,
      'README.md': readmeFileParcel(projectName, features),
      '.gitignore': gitignore(),
    },
    additionalFilesMap
  );

  // TODO there is some duplicated code here. sorry
  if (getNodeVersionPromise) {
    return getPackageJson(
      snowpackConfig,
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

export default generateProject;
