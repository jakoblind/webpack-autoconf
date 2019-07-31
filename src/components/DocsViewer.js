import React from 'react'
import _ from 'lodash'
import styles from '../styles.module.css'
export default function DocsViewer({
  hoverFeature,
  selectedFeatures,
  buildTool,
}) {
  const webpackDocsMap = {
    React: (
      <div>
        <p>
          React uses JSX which means you need a tool for transplining to regular
          javascript. Webpack doesn't do this out-of-the box. You can use either
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
    Vue: (
      <div>
        <p>
          Vue uses vue-loader to transpile the Vue code. This is configured in{' '}
          <code>webpack.config.js</code>
        </p>
        <p>
          Vue also requires <code>vue-style-loader</code> for transpiling
          styles.
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
          <code>webpack.config.js</code> file is configured to use Babel with
          the <code>babel-loader</code> plugin. It uses Babel for all files that
          matches the test regexp in <code>webpack.config.js</code>.
        </p>
        <p>
          The configuration file for babel can be found in <code>.babelrc</code>
          . The <code>@babel/preset-env</code> preset is used. It makes it
          possible to write ES6 code and it transpiles to ES5 code. When you
          select React, Babel is configured to use{' '}
          <code>@babel/preset-react</code>. This tells Babel to transpile the
          JSX to vanilla JS that the browser can understand.
        </p>
        <p>
          All required Babel dependencies are added to <code>package.json</code>
          .
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
          You can find the config for typescript in<code>tsconfig.json</code>.
          It uses some sensible default such as using sourcemaps, ES6 modules,
          and allowing JS code.
        </p>
      </div>
    ),
    CSS: (
      <div>
        <p>
          Webpack uses both <code>style-loader</code> and{' '}
          <code>css-loader</code> in <code>webpack.config.js</code>. So what's
          the difference between the two? <code>css-loader</code> takes the CSS
          and returns the CSS with the <code>imports</code> and{' '}
          <code>url(...)</code> resolved correctly. The{' '}
          <code>style-loader</code> adds the CSS to the DOM so that the styles
          are active and visible on the page.
        </p>
      </div>
    ),
    'CSS Modules': (
      <div>
        <p>
          CSS modules are activated by configuring the <code>css-loader</code>{' '}
          and passing in <code>modules: true</code> to it in{' '}
          <code>webpack.config.js</code>.
        </p>
        <p>
          When selecting both CSS Modules and CSS in this tool, CSS modules are
          only used on <code>*.module.css</code>. This is configured with the{' '}
          <code>exclude</code> and <code>include</code> keywords in{' '}
          <code>webpack.config.js</code>
        </p>
      </div>
    ),
    PostCSS: (
      <div>
        <p>
          PostCSS is enabled by adding <code>postcss-loader</code> to the CSS
          config in <code>webpack.config.js</code>
        </p>
        <p>
          <code>importLoaders</code> means that it also applies PostCSS loader
          to <code>@import</code>ed resources
        </p>
      </div>
    ),
  }
  const docsMap = {}
  const defaultDocs = <div />
  const hoverSelectedFeature = _.find(selectedFeatures, f => hoverFeature === f)

  const theDoc =
    buildTool === 'webpack' ? webpackDocsMap[hoverSelectedFeature] : null
  if (!hoverSelectedFeature || !theDoc) {
    return null
  }

  return <div className={styles.docsContainer}>{theDoc}</div>
}
