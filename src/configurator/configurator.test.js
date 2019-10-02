import { createWebpackConfig } from './configurator'

describe('Hot reload and Code split vs. `contenthash` in output filename', () => {
  const staticFilename = `filename: 'bundle.js'`
  const hashedFilename = `filename: '[name].[contenthash].js'`
  const modifiedFilename = '[name].[hash].js'
  const featureReact = 'React'
  const featureHot = 'React hot loader'
  const featureSplit = 'Code split vendors'

  test('static filename without Hot Reload and Code Split', () => {
    const result = createWebpackConfig([featureReact])

    expect(result).toContain(staticFilename)
    expect(result).not.toContain(hashedFilename)
    expect(result).not.toContain(modifiedFilename)
  })
  test('static filename when Hot Reload enabled', () => {
    const result = createWebpackConfig([featureReact, featureHot])

    expect(result).toContain(staticFilename)
    expect(result).not.toContain(hashedFilename)
    expect(result).not.toContain(modifiedFilename)
  })
  test('hashed filename when Code Split enabled', () => {
    const result = createWebpackConfig([featureReact, featureSplit])

    expect(result).not.toContain(staticFilename)
    expect(result).toContain(hashedFilename)
    expect(result).not.toContain(modifiedFilename)
  })
  test('hot version of hashed filename when Hot Reload and Code Split enabled', () => {
    const result = createWebpackConfig([featureReact, featureHot, featureSplit])

    expect(result).not.toContain(staticFilename)
    expect(result).toContain(hashedFilename)
    expect(result).toContain(modifiedFilename)
  })
})
