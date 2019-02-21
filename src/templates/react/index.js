import { joinToString } from '../helperFunctions'

export const reactIndexJs = (extraImports = []) => `import React from "react";
import ReactDOM from "react-dom";
${joinToString(extraImports)}
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
${joinToString(extraImports)}
class App extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

const AppWithHot = hot(module)(App);

var mountNode = document.getElementById("app");
ReactDOM.render(<AppWithHot name="Jane" />, mountNode);`

export const reactIndexTsx = (
  extraImports = []
) => `import * as React from 'react';
import * as ReactDOM from "react-dom";
${joinToString(extraImports)}
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
