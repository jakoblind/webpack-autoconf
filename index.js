import React from 'react';
import { render } from 'react-dom';
import jsStringify from "javascript-stringify";
import _ from "lodash";

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
};

const textboxStyles = {
    width: "400px",
    height: "400px",
    display: "block"
}

const baseWebpack = {
    entry: './src/index.js',
    output: {
        path: "path.resolve(__dirname, 'dist')",
        filename: 'bundle.js'
    }
}

const features = {
    "lodash": {
        webpack:
        (webpackConfig) =>
            Object.assign({}, webpackConfig, {
                lodash: true
            })
    },
    "React": {
        webpack: (webpackConfig) =>
            Object.assign({}, webpackConfig, {
                module: {
                    rules: [
                        {
                            test: /\.(js|jsx)$/,
                            exclude: /node_modules/,
                            use: 'babel-loader'
                        }
                    ]
                }
            })
    }
}
//jsStringify(features["React"]["webpack"](baseWebpack))
class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: {} }
        this.setSelected = this.setSelected.bind(this);
    }
    setSelected(feature) {
        const selected = Object.assign({}, this.state.selected, { [feature]: !this.state.selected[feature] })
        this.setState({ selected });
    }
    selectedArray(){
        return _.chain(this.state.selected).map((v, k) => v ? k : null).reject(_.isNull).value();
    }
    render() {
        return <div style={styles}>
            {_.map(_.keys(features), (feature) => <div><input checked={this.state.selected[feature]} onClick={() => this.setSelected(feature)} type="checkbox" /> {feature}</div>)}
            <div>{this.selectedArray()}</div>
            <div style={textboxStyles}>
            {jsStringify(_.reduce(this.selectedArray(), (acc = baseWebpack, currentValue) => features[currentValue]["webpack"](acc)))}
        </div>

            <textarea style={textboxStyles}>

        {jsStringify(features["React"]["webpack"](baseWebpack), null, 2)}
        </textarea>
            </div>

    }
}

const App = () => (
    <Configurator />
);

render(<App />, document.getElementById('app'));
