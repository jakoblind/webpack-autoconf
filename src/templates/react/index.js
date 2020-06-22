import { joinToString } from '../helperFunctions';

const tailwindcssClass = ' className="text-4xl text-white bg-black"';

export const reactAppJs = ({ isHot, isTailwindcss }) => `
import React from "react";
${isHot ? `import { hot } from 'react-hot-loader/root';\n` : ''}
class App extends React.Component {
  render() {
    const { name } = this.props;
    return <h1${isTailwindcss ? tailwindcssClass : ''}>Hello {name}</h1>;
  }
}

export default ${isHot ? 'hot(App)' : 'App'};
`;

export const reactIndexJs = (extraImports = []) => `import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
${joinToString(extraImports)}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`;

export const reactAppTsx = ({ isHot, isTailwindcss }) => `
import * as React from 'react';
${isHot ? 'import { hot } from "react-hot-loader/root";' : ''}
interface Props {
   name: string
}

class App extends React.Component<Props> {
  render() {
    const { name } = this.props;
    return <div${isTailwindcss ? tailwindcssClass : ''}>Hello {name}</div>;
  }
}

export default ${isHot ? 'hot(App)' : 'App'};
`;

export const reactIndexTsx = (
  extraImports = [],
  isHot
) => `import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';
${joinToString(extraImports)}
var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);
`;
