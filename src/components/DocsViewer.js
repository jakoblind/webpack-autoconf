import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from '../styles.module.css';

const webpackDocsMap = {
  Vue: (
    <div>
      <p>
        Vue uses <code>vue-loader</code> to transpile the Vue code. This is
        configured in <code>webpack.config.js</code>
      </p>
      <p>
        Vue also uses <code>vue-style-loader</code> for transpiling styles{' '}
        <i>instead</i> of the standard <code>style-loader</code>.
      </p>
      <p>
        A sample Vue app is created in <code>src/App.vue</code> and{' '}
        <code>src/index.js</code>
      </p>
    </div>
  ),
  Babel: (
    <div>
      <p>
        Babel is a tool for transpiling JavaScript code. The{' '}
        <code>webpack.config.js</code> file is configured to use Babel with the{' '}
        <code>babel-loader</code> plugin. It uses Babel for all files that
        matches the <code>test</code> regexp in <code>webpack.config.js</code>.
      </p>
      <p>
        The configuration file for babel can be found in <code>.babelrc</code>.
        In there you can see that <code>@babel/preset-env</code> preset is used.
        This is a preset that makes it possible to write ES6 code and it
        transpiles to ES5 code. When you select React then Babel is configured
        to use <code>@babel/preset-react</code>. This tells Babel to transpile
        the JSX to vanilla JS that the browser can understand.
      </p>
      <p>
        All required Babel dependencies are added to <code>package.json</code>.
      </p>
    </div>
  ),
  Typescript: (
    <div>
      <p>
        In <code>webpack.config.js</code> we configure webpack to use{' '}
        <code>ts-loader</code> for all files ending in <code>.ts</code> (or{' '}
        <code>.tsx</code> when using React).
      </p>
      <p>
        You can find the config for typescript in <code>tsconfig.json</code>. It
        uses some sensible default such as using sourcemaps, ES6 modules, and
        allowing JS code.
      </p>
    </div>
  ),
  CSS: (
    <div>
      <p>
        Webpack uses both <code>style-loader</code> and <code>css-loader</code>{' '}
        in <code>webpack.config.js</code>. So what's the difference between the
        two? <code>css-loader</code> takes the CSS and returns the CSS with the{' '}
        <code>imports</code> and <code>url(...)</code> resolved correctly. The{' '}
        <code>style-loader</code> adds the CSS to the DOM so that the styles are
        active and visible on the page.
      </p>
      <h3>Learn more</h3>
      <ul>
        <li>
          <a href="https://blog.jakoblind.no/css-modules-webpack/" target="new">
            How to configure CSS and CSS modules with webpack
          </a>
        </li>
      </ul>
    </div>
  ),
  'CSS Modules': (
    <div>
      <p>
        CSS modules are activated by configuring the <code>css-loader</code> and
        passing in <code>modules: true</code> to it in{' '}
        <code>webpack.config.js</code>. <code>importLoaders</code> means that it
        also applies CSS modules on <code>@import</code>ed resources
      </p>
      <p>
        When selecting both CSS Modules and CSS in this tool, CSS modules are
        only used on filenames matching the pattern <code>*.module.css</code>.
        This is configured with the <code>exclude</code> and{' '}
        <code>include</code> keywords in <code>webpack.config.js</code>
      </p>
      <h3>Learn more</h3>
      <ul>
        <li>
          <a href="https://blog.jakoblind.no/css-modules-webpack/" target="new">
            How to configure CSS and CSS modules with webpack
          </a>
        </li>
      </ul>
    </div>
  ),
  PostCSS: (
    <div>
      <p>
        PostCSS is enabled by adding <code>postcss-loader</code> to the CSS
        config in <code>webpack.config.js</code>
      </p>
      <p>
        <code>importLoaders</code> means that it also applies PostCSS loader to{' '}
        <code>@import</code>ed resources
      </p>
    </div>
  ),
  Sass: (
    <div>
      <p>
        Configuring Sass is very similar to configuring CSS. The only difference
        is that it also uses the <code>sass-loader</code> in addition to{' '}
        <code>style-loader</code> and <code>css-loader</code>
      </p>
    </div>
  ),
  Less: (
    <div>
      <p>
        Configuring Less is very similar to configuring CSS. The only difference
        is that it also uses the <code>less-loader</code> in addition to{' '}
        <code>style-loader</code> and <code>css-loader</code>
      </p>
    </div>
  ),
  stylus: (
    <div>
      <p>
        Configuring stylus is very similar to configuring CSS. The only
        difference is that it also uses the <code>stylus-loader</code> in
        addition to <code>style-loader</code> and <code>css-loader</code>
      </p>
    </div>
  ),
  SVG: (
    <div>
      <p>
        We configure support for SVG by using the <code>file-loader</code> in{' '}
        <code>webpack.config.js</code>. When you <code>import</code> or{' '}
        <code>require</code> a SVG file in your code, <code>file-loader</code>{' '}
        automatically put that file into the output directory and make sure it
        is referenced correctly from your code.
      </p>
    </div>
  ),
  PNG: (
    <div>
      <p>
        We configure support for PNG by using the <code>url-loader</code> in{' '}
        <code>webpack.config.js</code>. When you <code>import</code> or{' '}
        <code>require</code> a PNG file in your code, <code>url-loader</code>{' '}
        automatically put that file into the output directory and make sure it
        is referenced correctly from your code. If the PNG image is small
        enough, <code>url-loader</code> will transform the file into a Base64
        URI instead of referencing it as a file.
      </p>
    </div>
  ),
  moment: (
    <div>
      <p>
        moment is a library that handles time and timezones. By default it
        imports all data for all languages in the world. This can bloat the
        bundle. In this configuration we only import the <code>en</code> locale.
        We do this by using the <code>webpack.ContextReplacementPlugin</code> in{' '}
        <code>webpack.config.js</code>
      </p>
    </div>
  ),
  lodash: (
    <div>
      <p>
        Lodash is a utility library for Javascript. It has lots of functions and
        features, but you most likely will not use all of them. To make sure it
        doesn't bloat your bundle with unused code, we use{' '}
        <code>lodash-webpack-plugin</code> that we configure in{' '}
        <code>webpack.config.js</code>. This library remove features from lodash
        that is rarely used and takes lots of space in your bundle. Check the
        docs for details on what what features are removed.
      </p>
    </div>
  ),
  ESLint: (
    <div>
      <p>
        ESLint is a widely used linter for Javascript. The configuration
        generated in <code>.eslintrc.json</code> is very basic is a good
        starting point to extend with your own rules.
      </p>
    </div>
  ),
  Prettier: (
    <div>
      <p>
        Prettier is an opinionated code formatter. It automatically formats the
        code for you.
        <h3>Learn more</h3>
        <ul>
          <li>
            <a href="https://blog.jakoblind.no/prettier/" target="new">
              What is Prettier and how to configure it
            </a>
          </li>
        </ul>
      </p>
    </div>
  ),
  'Code split vendors': (
    <div>
      <p>
        Code split vendors means that we split up the bundle into two: one
        bundle contains the code you write, and the other contains all your
        dependencies. The reasoning behind this is that the code in the
        dependencies don't change as often as the code you write. That makes it
        possible to cache the dependencies longer than if everything were in one
        bundle.
      </p>
    </div>
  ),
};

const parcelDocsMap = {
  Babel: (
    <div>
      <p>Babel is a tool for transpiling JavaScript code.</p>
      <p>
        The configuration file for babel can be found in <code>.babelrc</code>.
        In there you can see that <code>@babel/preset-env</code> preset is used.
        This is a preset that makes it possible to write ES6 code and it
        transpiles to ES5 code. When you select React then Babel is configured
        to use <code>@babel/preset-react</code>. This tells Babel to transpile
        the JSX to vanilla JS that the browser can understand.
      </p>
      <p>
        All required Babel dependencies are added to <code>package.json</code>.
      </p>
    </div>
  ),
  Vue: (
    <div>
      <p>With Parcel, Vue works out-of-the box. No config required.</p>

      <p>
        A sample Vue app is created in <code>src/App.vue</code> and{' '}
        <code>src/index.js</code>
      </p>
    </div>
  ),
  Typescript: (
    <div>
      <p>
        With Parcel, Typescript works out-of-the box. No extra config required.
        Just use the <code>.ts</code> extension and it works.
      </p>
      <p>
        You can find the config for Typescript in <code>tsconfig.json</code>. It
        uses some sensible default such as using sourcemaps, ES6 modules, and
        allowing JS code.
      </p>
    </div>
  ),
};

const commonDocsMap = {
  React: (
    <div>
      <p>
        React uses JSX and you need a tool for transplining the JSX to regular
        Javascript. Webpack doesn't do this out-of-the box. You can use either
        Babel or Typescript for that. That's why Babel is preselected when
        selecting React in this tool.
      </p>
      <p>
        The required dependencies for React is <code>react</code> and{' '}
        <code>react-dom</code>. They are added in <code>package.json</code>
      </p>
      <p>
        A sample React app is created in <code>src/index.js</code>
      </p>
    </div>
  ),
  Prettier: (
    <div>
      <p>
        Prettier is an opinionated code formatter. It automatically formats the
        code for you.
        <ul>
          <li>
            <a href="https://blog.jakoblind.no/prettier/" target="new">
              What is Prettier and how to configure it
            </a>
          </li>
        </ul>
      </p>
    </div>
  ),
};
export const docsMap = buildTool =>
  buildTool === 'webpack'
    ? _.assign({}, webpackDocsMap, commonDocsMap)
    : _.assign({}, parcelDocsMap, commonDocsMap);

export default function DocsViewer({
  hoverFeature,
  selectedFeatures,
  buildTool,
}) {
  const hoverSelectedFeature = _.find(
    selectedFeatures,
    f => hoverFeature === f
  );

  const theDoc = docsMap(buildTool)[hoverSelectedFeature];

  if (!hoverSelectedFeature || !theDoc) {
    return null;
  }

  return <div className={styles.docsContainer}>{theDoc}</div>;
}

DocsViewer.propTypes = {
  hoverFeature: PropTypes.string,
  selectedFeatures: PropTypes.arrayOf(PropTypes.string),
  buildTool: PropTypes.string,
};

DocsViewer.defaultProps = {
  hoverFeature: '',
  selectedFeatures: [],
  buildTool: '',
};
