import React from 'react'
import styles from '../styles.module.css'
import Dropzone from 'react-dropzone'
import Layout from '../components/layout'

import {
  formatBytes,
  getDataFromStatsJson,
  isValidStatsFile,
} from '../webpackBundleOptimizeHelper'
import _ from 'lodash'

const EntryPointView = ({ entrypointAssetSizes, entrypointAssetSizeTotal }) => {
  const totalColor =
    entrypointAssetSizeTotal <= 250000
      ? styles.green
      : entrypointAssetSizeTotal <= 500000
      ? styles.orange
      : styles.red
  return (
    <div>
      <h3>Your entrypoints</h3>
      <p>
        Entrypoints are code that are loaded on page load. To get best possible
        user experience, you should keep the total size of entrypoints to less
        than 200kb and load the rest dynamically by using{' '}
        <a href="https://webpack.js.org/guides/code-splitting/#dynamic-imports">
          code splitting
        </a>
        .{' '}
      </p>
      <table>
        <tbody>
          {_.map(entrypointAssetSizes, e => (
            <tr>
              <td>
                <code>{e.name}</code>
              </td>
              <td>{e.size}</td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td className={totalColor}>
              {formatBytes(entrypointAssetSizeTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const DependenciesView = ({ dependenciesNotEs6 }) => {
  return (
    <div>
      <h3>Non-tree shakeable dependencies</h3>
      <p>
        Tree shaking removes unused code from your bundle. For it to work, you
        must use ES modules in your code and the dependencies. That means
        modules should use <code>export</code>/<code>import</code> keywords. The
        following dependencies are not ES modules. Look into if you can replace
        some of them.
      </p>
      {_.isEmpty(dependenciesNotEs6) ? (
        <p>You don't have any non-tree shakeable dependencies!</p>
      ) : (
        <table>
          <tbody>
            {_.map(dependenciesNotEs6, dep => (
              <tr>
                <td>{dep.name}</td> <td>{formatBytes(dep.size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const LargeDependencies = ({ dependencies }) => {
  const filteredDeps = _.filter(
    dependencies,
    d => d.name === 'lodash' || d.name === 'moment'
  )

  const message = _.map(filteredDeps, d => {
    if (d.name === 'lodash') {
      return (
        <p>
          You are using lodash. Consider using{' '}
          <a href="https://www.npmjs.com/package/lodash-es">lodash-es</a> and{' '}
          <a href="https://github.com/lodash/lodash-webpack-plugin">
            lodash-webpack-plugin
          </a>
        </p>
      )
    } else if (d.name === 'moment' && d.size > 250000) {
      return (
        <p>
          You are using moment and the size is {formatBytes(d.size)}. If you
          only use one timezone consider adding the following plugin to your
          webpack config
          <p>
            <code>
              new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
            </code>
          </p>
          Change nb to the timezone you are using
        </p>
      )
    }
  })

  return (
    <div>
      <h3>Large dependencies that can be optimized</h3>
      {_.isEmpty(filteredDeps)
        ? "You don't have any large dependencies that I know how you can optimize"
        : message}
    </div>
  )
}

const WebpackOptimizeHelper = ({ help, reset }) => {
  return (
    <div>
      <h2>Report</h2>
      <a href="#" onClick={reset}>
        Click here to use another stats.json file
      </a>
      <EntryPointView
        entrypointAssetSizes={help.entrypointAssetSizes}
        entrypointAssetSizeTotal={help.entrypointAssetSizeTotal}
      />
      <LargeDependencies dependencies={help.dependenciesNotEs6} />
      <DependenciesView dependenciesNotEs6={help.dependenciesNotEs6} />
    </div>
  )
}
const logToGa = ({ action, category, label }) => {
  if (process.env.GATSBY_LOG_GA === 'true') {
    window.ga('send', 'event', category, action, label)
  } else {
    console.log('GA send event: ', { category, action, label })
  }
}

class WebpackStatsAnalyzer extends React.Component {
  state = {
    help: null,
    error: false,
    errorMessages: null,
  }

  getReport(stats) {
    if (!_.isEmpty(stats.errors)) {
      const webpackConfigError = [
        'Try defining the path to your webpack.config.js file with --config <filename>',
        'Are you using create-react-app? Then run the following commands instead:',
        <code>npm run build -- --stats</code>,
        <code>mv build/bundle-stats.json stats.json</code>,
      ]

      if (
        stats.errors[0].startsWith(
          "Entry module not found: Error: Can't resolve './src'"
        )
      ) {
        return {
          error: true,
          errorMessages: webpackConfigError,
          ga: {
            category: 'error',
            action: 'upload-stats',
            label: 'src not found',
          },
        }
      } else {
        return {
          error: true,
          errorMessages: webpackConfigError,
          ga: {
            category: 'error',
            action: 'upload-stats',
            label: _.join(stats.errors, ','),
          },
        }
      }
    } else {
      const help = getDataFromStatsJson(stats)
      if (help) {
        return {
          error: false,
          help,
          ga: { category: 'optimizer', action: 'upload', label: 'ok' },
        }
      } else {
        return {
          tryChild: true,
          error: true,
          errorMessages: null,
          ga: {
            category: 'error',
            action: 'upload-stats',
            label: 'no entrypoint, assets',
          },
        }
      }
    }
  }
  onDrop(acceptedFiles) {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      try {
        if (_.isEmpty(reader.result)) {
          this.setState({
            error: true,
            errorMessages: ['Your stats.json file is empty'],
          })
          logToGa({
            category: 'error',
            action: 'upload-stats',
            label: 'empty stats.json file',
          })

          return
        }
        const fileAsBinaryString = JSON.parse(reader.result)

        const report = this.getReport(fileAsBinaryString)
        if (report.error) {
          this.setState({
            error: report.error,
            errorMessages: report.errorMessages,
          })
          logToGa(report.ga)
        } else {
          this.setState({
            error: report.error,
            errorMessages: report.errorMessages,
            help: report.help,
          })
          logToGa(report.ga)
        }
      } catch (error) {
        this.setState({ error: true, errorMessages: [error.message] })
        logToGa({
          category: 'error',
          action: 'upload-stats',
          label: 'Exception: ' + error.name + ' ' + error.message,
        })
      }
    }
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsBinaryString(file)
  }
  render() {
    return (
      <div>
        {this.state.help ? (
          <WebpackOptimizeHelper
            help={this.state.help}
            reset={() => this.setState({ help: null })}
          />
        ) : (
          <div>
            <div>
              <h2>Instructions to generate your report</h2>
              {this.state.error ? (
                <p className={styles.error}>
                  There was a problem loading the stats.json file. <br />
                  {!_.isEmpty(this.state.errorMessages)
                    ? _.map(this.state.errorMessages, e => <p>{e}</p>)
                    : null}
                </p>
              ) : null}
              First run webpack the same way you do for a production build, but
              add <code>--profile --json > stats.json</code> at the end.
              Example:
              <br />
              <br />
              <code className="code">
                npx webpack --mode production --profile --json > stats.json
              </code>
              <br />
              <br />
              Open the stats.json file in a text editor and remove lines of text
              at the top that are not part of the JSON structure (if there are
              any)
              <br />
              <br />
            </div>{' '}
            <Dropzone
              onDrop={files => this.onDrop(files)}
              style={{
                width: '100%',
                border: '2px dashed #33ff00',
                padding: '1em',
                cursor: 'pointer',
                paddingTop: '5rem',
                paddingBottom: '5rem',
              }}
            >
              <p className={styles.dropFileText}>
                Then drop <code>stats.json</code> here or click and select{' '}
                <code>stats.json</code>.
              </p>
            </Dropzone>
          </div>
        )}
      </div>
    )
  }
}

export default () => {
  return (
    <Layout
      title="Webpack bundle optimize helper"
      metaDescription="Upload webpack stats.json and get a custom report on what you can do to optimize your webpack bundle size."
    >
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Bundle optimize helper</h1>
        <p>
          You are concerned about your bundle size. You are not sure what is an
          acceptable bundle size and if yours is too big.
        </p>
        <p>
          This tool will analyze your bundle and give you actionable suggestions
          on what to improve to reduce your bundle size. All you have to do is
          generate a stats file and upload that file to this tool and you will
          get a customized report.
        </p>
        <p>
          Does anything look wrong or weird? Let me know on twitter{' '}
          <a href="https://twitter.com/karljakoblind">@karljakoblind</a> or
          create an{' '}
          <a href="https://github.com/jakoblind/webpack-autoconf">
            issue on github
          </a>
          .
        </p>

        <WebpackStatsAnalyzer />
      </div>
    </Layout>
  )
}
