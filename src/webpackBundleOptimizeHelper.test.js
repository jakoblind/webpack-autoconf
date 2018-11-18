import {
  entrypointsContainsJS,
  findChildWithJSEntry,
  trimJsonString,
} from './webpackBundleOptimizeHelper'

test('trimJsonString should trim json', () => {
  const jsonString = `some stuff here
{
 "errors": []
}`
  expect(trimJsonString(jsonString)).toEqual(`{
 "errors": []
}`)
})

test('entrypointContainsJS contains js should return true', () => {
  const entrypointWithJs = {
    app: {
      chunks: [3, 2],
      assets: [
        'static/vendor.a9426aeed76ba0927898.js',
        'styles/styles.a9426aeed76ba0927898.css',
        'static/vendor.a9426aeed76ba0927898.js.map',
        'styles/styles.a9426aeed76ba0927898.css.map',
        'static/app.a9426aeed76ba0927898.js',
        'styles/styles.a9426aeed76ba0927898.css',
        'static/app.a9426aeed76ba0927898.js.map',
        'styles/styles.a9426aeed76ba0927898.css.map',
      ],
      isOverSizeLimit: true,
    },
  }

  expect(entrypointsContainsJS(entrypointWithJs)).toBe(true)
})

test('entrypointContainsJS contains no js should return false', () => {
  const entrypointWithJs = {
    undefined: {
      chunks: [0],
      assets: ['index.html'],
    },
  }

  expect(entrypointsContainsJS(entrypointWithJs)).toBe(false)
})

test('findChildWithJSEntry: stats file with no js entry should return null', () => {
  const statsJson = {}

  expect(findChildWithJSEntry(statsJson)).toBe(null)
})

test('findChildWithJSEntry: stats file with js entry, modules and assets should return itself', () => {
  const statsJson = {
    entrypoints: {
      app: {
        chunks: [3, 2],
        assets: [
          'static/vendor.a9426aeed76ba0927898.js',
          'styles/styles.a9426aeed76ba0927898.css',
        ],
        isOverSizeLimit: true,
      },
    },
    assets: [
      {
        name: 'static/DynamicPage.a9426aeed76ba0927898.js.map',
        size: 810,
        chunks: [1],
        chunkNames: ['DynamicPage'],
        emitted: true,
      },
    ],
    modules: [
      {
        id: 0,
        identifier:
          '/home/jlind/dev/boilerplates/react-starter-boilerplate-hmr/node_modules/react/index.js',
        name: './node_modules/react/index.js',
        index: 90,
        index2: 88,
        size: 190,
        cacheable: true,
        built: true,
      },
    ],
  }

  expect(findChildWithJSEntry(statsJson)).toBe(statsJson)
})

test('findChildWithJSEntry: stats file with NO js entry, but modules and assets and no children should return null', () => {
  const statsJson = {
    entrypoints: {
      app: {
        chunks: [3, 2],
        assets: ['styles/styles.a9426aeed76ba0927898.css'],
        isOverSizeLimit: true,
      },
    },
    assets: [
      {
        name: 'static/DynamicPage.a9426aeed76ba0927898.js.map',
        size: 810,
        chunks: [1],
        chunkNames: ['DynamicPage'],
        emitted: true,
      },
    ],
    modules: [
      {
        id: 0,
        identifier:
          '/home/jlind/dev/boilerplates/react-starter-boilerplate-hmr/node_modules/react/index.js',
        name: './node_modules/react/index.js',
        index: 90,
        index2: 88,
        size: 190,
        cacheable: true,
        built: true,
      },
    ],
  }

  expect(findChildWithJSEntry(statsJson)).toBe(null)
})

test('findChildWithJSEntry: invalid root, but first child valid should return first child ', () => {
  const statsJson = {
    children: [
      {
        entrypoints: {
          app: {
            chunks: [3, 2],
            assets: ['styles/styles.a9426aeed76ba0927898.js'],
            isOverSizeLimit: true,
          },
        },
        assets: [
          {
            name: 'static/DynamicPage.a9426aeed76ba0927898.js.map',
            size: 810,
            chunks: [1],
            chunkNames: ['DynamicPage'],
            emitted: true,
          },
        ],
        modules: [
          {
            id: 0,
            identifier:
              '/home/jlind/dev/boilerplates/react-starter-boilerplate-hmr/node_modules/react/index.js',
            name: './node_modules/react/index.js',
            index: 90,
            index2: 88,
            size: 190,
            cacheable: true,
            built: true,
          },
        ],
      },
    ],
  }

  expect(findChildWithJSEntry(statsJson)).toBe(statsJson.children[0])
})

test('findChildWithJSEntry: invalid root, but second child valid should return second child ', () => {
  const statsJson = {
    children: [
      {
        entrypoints: {
          undefined: {
            chunks: [0],
            assets: ['index.html'],
          },
        },
        assets: [
          {
            name: 'index.html',
            size: 544488,
            chunks: [0],
            chunkNames: [],
          },
        ],
        modules: [
          {
            id: 0,
            identifier: '/usr/lib/node_modules/webpack/buildin/module.js',
            name: '(webpack)/buildin/module.js',
            index: 3,
            index2: 1,
            size: 519,
            cacheable: true,
            built: true,
          },
        ],
      },
      {
        entrypoints: {
          app: {
            chunks: [3, 2],
            assets: ['styles/styles.a9426aeed76ba0927898.js'],
            isOverSizeLimit: true,
          },
        },
        assets: [
          {
            name: 'static/DynamicPage.a9426aeed76ba0927898.js.map',
            size: 810,
            chunks: [1],
            chunkNames: ['DynamicPage'],
            emitted: true,
          },
        ],
        modules: [
          {
            id: 0,
            identifier:
              '/home/jlind/dev/boilerplates/react-starter-boilerplate-hmr/node_modules/react/index.js',
            name: './node_modules/react/index.js',
            index: 90,
            index2: 88,
            size: 190,
            cacheable: true,
            built: true,
          },
        ],
      },
    ],
  }

  expect(findChildWithJSEntry(statsJson)).toBe(statsJson.children[1])
})
