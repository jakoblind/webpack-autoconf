import Link from 'next/link';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as styles from '../styles.module.css';
import {
  webpackConfig,
  parcelConfig,
  snowpackConfig,
} from '../configurator/configurator-config';
import { getNpmDependencies } from '../configurator/configurator';
export const StepByStepArea = ({
  features,
  newBabelConfig,
  isReact,
  bundler,
}) => {
  const isWebpack = bundler === 'webpack';
  let config = webpackConfig;
  if (bundler === 'parcel') {
    config = parcelConfig;
  } else if (bundler === 'snowpack') {
    config = snowpackConfig;
  }
  const newNpmConfig = getNpmDependencies(config, features);

  const npmInstallCommand = _.isEmpty(newNpmConfig.dependencies)
    ? ''
    : `\nnpm install ${newNpmConfig.dependencies.join(' ')}`;
  const npmCommand = `mkdir myapp\ncd myapp\nnpm init -y\nnpm install --save-dev ${newNpmConfig.devDependencies.join(
    ' '
  )}${npmInstallCommand}`;
  const isTypescript = _.includes(features, 'typescript');

  let babelStep = null;
  if (newBabelConfig) {
    babelStep = (
      <div>
        <li>
          Create <i>.babelrc</i> in the root and copy the contents of the
          generated file
        </li>
      </div>
    );
  } else if (isTypescript) {
    // currently, you cannt use both typescript and babel.
    // if typescript is selected you must have a tsconf
    babelStep = (
      <div>
        <li>
          Create <i>tsconfig.json</i> in the root and copy the contents of the
          generated file
        </li>
      </div>
    );
  }
  let webpackStep = null;
  if (isWebpack) {
    webpackStep = (
      <li>
        Create <i>webpack.config.js</i> in the root and copy the contents of the
        generated file
      </li>
    );
  }

  const srcFoldersStep = (
    <li>Create folders src and dist and create source code files</li>
  );

  return (
    <div className={styles.rightSection}>
      <div>
        <h3>How to create your project yourself</h3>
        <ol>
          <li>Create an NPM project and install dependencies</li>
          <textarea
            aria-label="npm commands to install dependencies"
            readOnly
            rows="6"
            cols="50"
            value={npmCommand}
          />
          {webpackStep}

          {babelStep}
          {srcFoldersStep}
        </ol>
        {isWebpack ? (
          <Link href="/webpack-course">
            <a>Need more detailed instructions?</a>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

StepByStepArea.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  newBabelConfig: PropTypes.string,
  isReact: PropTypes.bool.isRequired,
  bundler: PropTypes.string.isRequired,
};

StepByStepArea.defaultProps = {
  newBabelConfig: null, // createBabelConfig function returns null if babel is not selected
};
