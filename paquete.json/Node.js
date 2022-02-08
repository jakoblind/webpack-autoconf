{
  "name": "create-app",
  "version": "1.0.6",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build && next export",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf bin dist",
    "test": "jest",
    "cli-build": "parcel build --target=node --out-dir bin webpack-autoconf.js",
    "cli-watch": "parcel watch --target=node --out-dir bin webpack-autoconf.js",
    "cli-append-shebang": "echo '#! /usr/bin/env node'  | cat - bin/webpack-autoconf.js > /tmp/out && mv /tmp/out bin/webpack-autoconf.js",
    "cli-link": "chmod +x bin/webpack-autoconf.js && npm link",
    "cli-install-local": "npm run cli-build; npm run cli-append-shebang; npm run cli-link",
    "prepublishOnly": "npm run cli-build; npm run cli-append-shebang"
  },
  "files": [
    "bin/webpack-autoconf.js",
    "bin/webpack-autoconf.map"
  ],
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bin": {
    "webpack-autoconf": "bin/webpack-autoconf.js"
  },
  "dependencies": {
    "bluebird": "^3.7.2",
    "combinations": "^1.0.0",
    "diff": "^5.0.0",
    "file-saver": "^2.0.5",
    "javascript-stringify": "^2.1.0",
    "jszip": "^3.7.1",
    "lodash": "^4.17.21",
    "memoizee": "^0.4.15",
    "next": "^12.0.8",
    "node-fetch": "^3.0.0",
    "postcss": "^8.3.8",
    "prismjs": "^1.25.0",
    "react": "^17.0.2",
    "react-countdown-now": "^2.1.2",
    "react-dom": "^17.0.2",
    "react-joyride": "^2.3.1",
    "react-modal": "^3.14.3",
    "react-share": "^4.4.0",
    "validate-npm-package-name": "^3.0.0",
    "webpack-optimize-helper": "^1.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.15.5",
    "@babel/plugin-proposal-class-properties": "^7.14.5",
    "@babel/plugin-proposal-optional-chaining": "^7.14.5",
    "@babel/preset-env": "^7.15.6",
    "@babel/preset-react": "^7.14.5",
    "@next/eslint-plugin-next": "^12.0.8",
    "babel-core": "^7.0.0-bridge.0",
    "babel-eslint": "^10.1.0",
    "babel-jest": "^27.2.3",
    "babel-plugin-prismjs": "^2.1.0",
    "eslint": "^7.32.0",
    "eslint-config-next": "12.0.8",
    "eslint-plugin-lodash": "^7.3.0",
    "husky": "^7.0.2",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^27.2.3",
    "lint-staged": "^11.1.2",
    "parcel-bundler": "^1.12.5",
    "prettier": "^2.4.1"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier —-write",
      "git add"
    ]
  }
}
