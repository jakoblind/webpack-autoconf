export const reactIndexJs = `import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`

export const reactHotIndexJs = `import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader'

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

export const reactIndexTsx = `import * as React from 'react';
import * as ReactDOM from "react-dom";

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
