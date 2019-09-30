import { joinToString } from '../helperFunctions'

export const reactAppJs = isHot => `
import React from "react";
${isHot ? `import { hot } from "react-hot-loader";\n` : ''}
class App extends React.Component {
  render() {
    const { name } = this.props;
    return <div>Hello {name}</div>;
  }
}

export default ${isHot ? 'hot(module)(App)' : 'App'};
`

export const reactIndexJs = (extraImports = []) => `import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
${joinToString(extraImports)}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`

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
