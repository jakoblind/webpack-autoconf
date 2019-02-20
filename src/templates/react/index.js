import _ from 'lodash'

export const reactIndexJs = (extraImports = []) => `import React from "react";
import ReactDOM from "react-dom";
${_.map(extraImports, i => i + '\n')}
class App extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`

export const reactHotIndexJs = (
  extraImports = []
) => `import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader'
${_.map(extraImports, i => i + '\n')}
class App extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

const AppWithHot = hot(module)(App);

var mountNode = document.getElementById("app");
ReactDOM.render(<AppWithHot name="Jane" />, mountNode);`

export const reactIndexHtml = (bundleFilename = 'bundle.js') => `<!DOCTYPE html>
<html>
    <head>
        <title>React starter app</title>
        <meta charset="utf-8">
    </head>
    <body>
        <div id="app"></div>
        <script src="${bundleFilename}"></script>
    </body>
</html>`

export const reactIndexTsx = (
  extraImports = []
) => `import * as React from 'react';
import * as ReactDOM from "react-dom";
${_.map(extraImports, i => i + '\n')}
interface Props {
   name: string
}

class App extends React.Component<Props> {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`
