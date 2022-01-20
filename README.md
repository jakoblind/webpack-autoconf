# webpack autoconf (createapp.dev)

A tool to create personalized and optimized webpack or Parcel project. Creating a webpack project should be simple for everyone!

This tool is available both as CLI and as a online web tool.

The web tool is running on [createapp.dev](https://createapp.dev)

## Run web version locally

Make sure you use NPM 8 or later

```sh
npm install
npm run dev
```

Point your browser to http://localhost:8000

## CLI

Usage: webpack-autoconf new [project-name] [features]

Where [features] can be any combination of:

- React
- Vue
- CSS
- Sass
- Less
- stylus
- SVG
- PNG
- moment
- lodash

Example: webpack-autoconf new myProject React PNG

A complete project is created containing `webpack.config.js`, `package.json`, "hello world" source files, and if required a `.babelrc`.

### Build CLI on your machine

```sh
npm run cli-build
```

Then you can run it with

```sh
node bin/webpack-autoconf.js
```

## Contributing

If you have an idea for a new feature, please create an issue or participate in an existing issue. PRs are also very much welcome!
