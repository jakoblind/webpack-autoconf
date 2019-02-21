import _ from 'lodash'

import { css, scss, less } from '../templates/styling'
import { reactIndexJs } from '../templates/react/index'
import { indexHtml } from '../templates/base'
import { emptyIndexJs } from '../templates/empty/index'

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, 'CSS')
  const isSass = _.includes(configItems, 'Sass')
  const isLess = _.includes(configItems, 'Less')
  return _.concat(
    [],
    isCss ? [`import "./styles.css";`] : [],
    isSass ? [`import "./styles.scss";`] : [],
    isLess ? [`import "./styles.less";`] : []
  )
}
export default (() => {
  const features = {
    React: {
      group: 'Main library',
      dependencies: configItems => ['react', 'react-dom'],
      files: configItems => {
        return {
          'src/index.js': reactIndexJs(getStyleImports(configItems)),
          'src/index.html': indexHtml('index.js'),
        }
      },
    },
    Babel: {
      group: 'Transpiler',
      babel: (babelConfig, configItems) =>
        Object.assign({}, babelConfig, {
          presets: _.concat(
            [['@babel/preset-env', { modules: false }]],
            _.includes(configItems, 'React') ? '@babel/preset-react' : []
          ),
        }),
      devDependencies: configItems =>
        _.concat(
          ['babel-loader', '@babel/core', '@babel/preset-env'],
          _.includes(configItems, 'React') ? '@babel/preset-react' : null
        ),
    },
    CSS: {
      group: 'Styling',
      files: configItems => ({ 'src/styles.css': css }),
    },
    Sass: {
      group: 'Styling',
      //devDependencies: configItems => ['sass'],//ToDO is thiss needed?
      files: configItems => ({ 'src/styles.scss': scss }),
    },
    Less: {
      group: 'Styling',
      files: configItems => ({ 'src/styles.less': less }),
    },
  }
  const featuresNoNulls = _.mapValues(features, item => {
    if (!item.babel) {
      item.babel = _.identity
    }
    if (!item.dependencies) {
      item.dependencies = () => []
    }
    if (!item.devDependencies) {
      item.devDependencies = () => []
    }
    if (!item.packageJson) {
      item.packageJson = {}
    }
    if (!item.files) {
      item.files = () => {}
    }

    return item
  })
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
        const isReact = _.includes(configItems, 'React')

        if (!isReact) {
          return {
            'src/index.js': emptyIndexJs(getStyleImports(configItems)),
            'src/index.html': indexHtml('index.js'),
          }
        } else {
          return []
        }
      },
    },
  }
})()
