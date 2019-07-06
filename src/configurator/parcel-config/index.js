import _ from 'lodash'

import { css, scss, less, stylus } from '../../templates/styling'
import { reactIndexJs, reactIndexTsx } from '../../templates/react/index'
import { indexHtml } from '../../templates/base'
import { emptyIndexJs } from '../../templates/empty/index'
import { tsconfig, tsconfigReact, indexTypescript } from '../../templates/ts'
import {
  vueHelloWorldJs,
  vueHelloWorldTS,
  vueIndexAppVue,
  vueIndexTs,
  vueShimType,
} from '../../templates/vue'

function getStyleImports(configItems) {
  const isCss = _.includes(configItems, 'CSS')
  const isSass = _.includes(configItems, 'Sass')
  const isLess = _.includes(configItems, 'Less')
  const isStylus = _.includes(configItems, 'stylus')
  return _.concat(
    [],
    isCss ? [`import "./styles.css";`] : [],
    isSass ? [`import "./styles.scss";`] : [],
    isLess ? [`import "./styles.less";`] : [],
    isStylus ? [`import "./styles.styl";`] : []
  )
}
export default (() => {
  const features = {
    React: {
      group: 'Main library',
      dependencies: configItems => ['react', 'react-dom'],
      files: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript')
        const extraImports = getStyleImports(configItems)

        if (isTypescript) {
          return {
            'src/index.tsx': reactIndexTsx(extraImports),
            'src/index.html': indexHtml('index.tsx'),
          }
        } else {
          return {
            'src/index.js': reactIndexJs(extraImports),
            'src/index.html': indexHtml('index.js'),
          }
        }
      },
    },
    Vue: {
      group: 'Main library',
      dependencies: configItems => ['vue'],
      files: configItems => {
        const isTypescript = _.includes(configItems, 'Typescript')
        const indexExtension = isTypescript ? 'ts' : 'js'
        const isCss = _.includes(configItems, 'CSS')
        const isLess = _.includes(configItems, 'Less')
        const isSass = _.includes(configItems, 'Sass')
        const isStylus = _.includes(configItems, 'stylus')
        const cssStyle = `<style>
${css}
</style>`
        const lessStyle = `<style lang="less">
${less}
</style>`
        const sassStyle = `<style lang="scss">
${scss}
</style>`
        const stylusStyle = `<style lang="styl">
${stylus}
</style>`
        const styling = _.concat(
          [],
          isCss ? cssStyle : [],
          isSass ? sassStyle : [],
          isLess ? lessStyle : [],
          isStylus ? stylusStyle : []
        )

        return _.assign(
          {
            'src/App.vue': vueIndexAppVue(_.join(styling, '\n')),
            'src/index.html': indexHtml(`index.${indexExtension}`),
            [`src/index.${indexExtension}`]: vueIndexTs(),
          },
          isTypescript ? { 'vue-shim.d.ts': vueShimType } : {}
        )
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
          ['@babel/core', '@babel/preset-env'],
          _.includes(configItems, 'React') ? '@babel/preset-react' : []
        ),
    },
    Typescript: {
      group: 'Transpiler',
      files: configItems => {
        const isReact = _.includes(configItems, 'React')
        const isVue = _.includes(configItems, 'Vue')

        const configFiles = isReact
          ? { 'tsconfig.json': tsconfigReact }
          : { 'tsconfig.json': tsconfig }
        const sourceFiles =
          !isReact && !isVue
            ? {
                'src/index.html': indexHtml('index.ts'),
                'src/index.ts': emptyIndexJs(),
              }
            : {}
        return _.assign(configFiles, sourceFiles)
      },
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
    stylus: {
      group: 'Styling',
      files: configItems => ({ 'src/styles.styl': stylus }),
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
        const isTypescript = _.includes(configItems, 'Typescript')
        const isVue = _.includes(configItems, 'Vue')
        if (!isReact && !isTypescript && !isVue) {
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
