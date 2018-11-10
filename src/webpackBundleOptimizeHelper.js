const concat = (x, y) => x.concat(y)

const flatMap = (f, xs) => xs.map(f).reduce(concat, [])

//https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(a, b) {
  if (0 === a) return '0 Bytes'
  var c = 1024,
    d = b || 2,
    e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

const getDependencyNameFromModuleName = m => {
  // eslint-disable-next-line
  const regexResult = /.\/node_modules\/([^\/]+)\/.*/.exec(m)
  return regexResult && regexResult.length > 0 ? regexResult[1] : m
  //return m
}

export function isValidStatsFile(json) {
  return !!json.entrypoints && !!json.modules && !!json.assets
}
export function getDataFromStatsJson(json) {
  if (!json) {
    return {}
  }
  const entrypoints = Object.keys(json.entrypoints)
  const entrypointAssets = flatMap(
    entrypoint => json.entrypoints[entrypoint].assets,
    entrypoints
  )
  const modules = json.modules.map(m => {
    const optimizationBailout = m.optimizationBailout.filter(
      b =>
        b === 'ModuleConcatenation bailout: Module is not an ECMAScript module'
    )
    return {
      name: m.name,
      notEs6: optimizationBailout.length !== 0,
      size: m.size,
    }
  })
  //  const removeDuplicate = (elem, pos, arr) => arr.indexOf(elem) === pos
  const dependenciesNotEs6 = modules
    .filter(m => !m.name.startsWith('(webpack)'))
    .filter(m => m.name.startsWith('./node_modules'))
    .map(m =>
      Object.assign({}, m, {
        name: getDependencyNameFromModuleName(m.name),
      })
    )
    .filter(m => m.notEs6)
    //remove duplicates
    .reduce((result = [], object) => {
      const existing = result.find(r => r.name === object.name)

      if (existing) {
        const newObject = {
          name: object.name,
          notEs6: object.notEs6,
          size: existing.size + object.size,
        }
        return concat(result.filter(r => r.name !== object.name), newObject)
      } else {
        return result.concat(object)
      }
    }, [])
  //.map(m => m.name)
  //.filter(removeDuplicate)

  const entrypointAssetSizes = json.assets
    .filter(a => entrypointAssets.includes(a.name))
    .map(a => ({
      name: a.name,
      size: formatBytes(a.size),
      sizeByte: a.size,
    }))

  const entrypointAssetSizeTotal = entrypointAssetSizes.reduce(
    (acc, o) => acc + o.sizeByte,
    0
  )

  //TODO check if moduleconcatenation plugin is in use

  //console.log('modules', dependenciesNotEs6)
  //console.log('entrypointAssetSizes', entrypointAssetSizes)

  return {
    dependenciesNotEs6,
    entrypointAssetSizes,
    entrypointAssetSizeTotal,
  }
}

export class BundleOptimizeHelperWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('BundleOptimizeHelperWebpackPlugin', stats => {
      //      const json = stats.toJson({ source: false })
      // do stuffs here
    })
  }
}
