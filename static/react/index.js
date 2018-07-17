export const reactIndexJs = `import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`;

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
ReactDOM.render(<AppWithHot name="Jane" />, mountNode);`;

export const reactIndexHtml = `<!DOCTYPE html>
<html>
    <head>
        <title>React starter app</title>
    </head>
    <body>
        <div id="app"></div>
        <script src="bundle.js"></script>
    </body>
</html>`
