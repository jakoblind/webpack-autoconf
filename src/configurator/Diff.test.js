import { getDiffAsLineNumber } from './Diff'

test('equal should return empty string', () => {
  const json1 = {
    a: 'b',
  }
  const json2 = {
    a: 'b',
  }

  expect(getDiffAsLineNumber(json1, json2)).toBe('')
})

test('one line diff', () => {
  const json1 = {
    dependencies: { react: '1.2.3' },
  }
  const json2 = {
    dependencies: {},
  }

  expect(getDiffAsLineNumber(json1, json2)).toBe('2-2')
})

test('real example with json input', () => {
  const json1 = {
    name: 'empty-project-react-react-hot-loader',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    keywords: [],
    author: '',
    license: 'ISC',
    scripts: {
      clean: 'rm dist/bundle.js',
      'build-dev': 'webpack -d --mode development',
      'build-prod': 'webpack -p --mode production',
      start: 'webpack-dev-server --hot --mode development',
    },
    dependencies: {
      'react-hot-loader': '^4.3.11',
    },
    devDependencies: {
      webpack: '^4.20.2',
      'webpack-cli': '^3.1.2',
      'webpack-dev-server': '^3.1.9',
    },
  }
  const json2 = {
    name: 'empty-project-react-react-hot-loader',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    keywords: [],
    author: '',
    license: 'ISC',
    scripts: {
      clean: 'rm dist/bundle.js',
      'build-dev': 'webpack -d --mode development',
      'build-prod': 'webpack -p --mode production',
      start: 'webpack-dev-server --hot --mode development',
    },
    dependencies: {
      react: '^16.5.2',
      'react-dom': '^16.5.2',
      'react-hot-loader': '^4.3.11',
    },
    devDependencies: {
      webpack: '^4.20.2',
      'webpack-cli': '^3.1.2',
      'babel-loader': '^8.0.4',
      '@babel/preset-react': '^7.0.0',
      '@babel/core': '^7.1.2',
      '@babel/preset-env': '^7.1.0',
      'webpack-dev-server': '^3.1.9',
    },
  }

  // the json are canoncialized
  expect(getDiffAsLineNumber(json1, json2)).toBe('4-5,10-13')
})

test('real example with string input', () => {
  const json1 = JSON.stringify(
    {
      name: 'empty-project-react-react-hot-loader',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      keywords: [],
      author: '',
      license: 'ISC',
      scripts: {
        clean: 'rm dist/bundle.js',
        'build-dev': 'webpack -d --mode development',
        'build-prod': 'webpack -p --mode production',
        start: 'webpack-dev-server --hot --mode development',
      },
      dependencies: {
        'react-hot-loader': '^4.3.11',
      },
      devDependencies: {
        webpack: '^4.20.2',
        'webpack-cli': '^3.1.2',
        'webpack-dev-server': '^3.1.9',
      },
    },
    null,
    2
  )

  const json2 = JSON.stringify(
    {
      name: 'empty-project-react-react-hot-loader',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      keywords: [],
      author: '',
      license: 'ISC',
      scripts: {
        clean: 'rm dist/bundle.js',
        'build-dev': 'webpack -d --mode development',
        'build-prod': 'webpack -p --mode production',
        start: 'webpack-dev-server --hot --mode development',
      },
      dependencies: {
        react: '^16.5.2',
        'react-dom': '^16.5.2',
        'react-hot-loader': '^4.3.11',
      },
      devDependencies: {
        webpack: '^4.20.2',
        'webpack-cli': '^3.1.2',
        'babel-loader': '^8.0.4',
        '@babel/preset-react': '^7.0.0',
        '@babel/core': '^7.1.2',
        '@babel/preset-env': '^7.1.0',
        'webpack-dev-server': '^3.1.9',
      },
    },
    null,
    2
  )

  // the json are canoncialized
  expect(getDiffAsLineNumber(json1, json2, true)).toBe('16-17,23-26')
})
