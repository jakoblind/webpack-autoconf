import _ from 'lodash';
import { joinToString } from '../helperFunctions';

const tailwindcssClass = ' className="text-4xl text-white bg-black"';

export const reactAppJs = configItems => {
  const isHot = _.includes(configItems, 'react-hot-loader');
  const isTailwindcss = _.includes(configItems, 'tailwind-css');
  const isMaterialUI = _.includes(configItems, 'material-ui');
  const isBootstrap = _.includes(configItems, 'bootstrap');
  return `
import React from "react";
${isHot ? `import { hot } from 'react-hot-loader/root';\n` : ''}${
    isMaterialUI ? `import Button from '@material-ui/core/Button';\n` : ''
  }${
    isBootstrap
      ? `import 'bootstrap';\nimport 'bootstrap/dist/css/bootstrap.min.css';\n`
      : ''
  }
class App extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>
        <h1${isTailwindcss ? tailwindcssClass : ''}>
          Hello {name}
        </h1>${
          isMaterialUI
            ? `\n        <Button variant="contained">this is a material UI button</Button>`
            : ''
        }${
    isBootstrap
      ? `\n        <button type="button" class="btn btn-primary">
          This is a bootstrap button
        </button>`
      : ''
  }
      </>
    );
  }
}

export default ${isHot ? 'hot(App)' : 'App'};
`;
};

export const reactIndexJs = (extraImports = []) => `import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
${joinToString(extraImports)}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);`;

export const reactAppTsx = configItems => {
  const isHot = _.includes(configItems, 'react-hot-loader');
  const isTailwindcss = _.includes(configItems, 'tailwind-css');
  const isMaterialUI = _.includes(configItems, 'material-ui');
  const isBootstrap = _.includes(configItems, 'bootstrap');
  return `
import * as React from 'react';
${isHot ? 'import { hot } from "react-hot-loader/root";\n' : ''}${
    isMaterialUI ? `import Button from '@material-ui/core/Button';\n` : ''
  }${
    isBootstrap
      ? `import 'bootstrap';\nimport 'bootstrap/dist/css/bootstrap.min.css';\n`
      : ''
  }
interface Props {
   name:
    string
}

class App extends React.Component<Props> {
  render() {
    const { name } = this.props;
    return (
      <>
        <h1${isTailwindcss ? tailwindcssClass : ''}>
          Hello {name}
        </h1>${
          isMaterialUI
            ? `\n        <Button variant="contained">this is a material UI button</Button>`
            : ''
        }${
    isBootstrap
      ? `\n        <button type="button" class="btn btn-primary">
          This is a bootstrap button
        </button>`
      : ''
  }
      </>
    );
  }
}

export default ${isHot ? 'hot(App)' : 'App'};
`;
};

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
