import React from 'react';
import { render } from 'react-dom';
import jsStringify from "javascript-stringify";
import _ from "lodash";
import { features, baseWebpack, createConfig } from "./configurator";

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
};

const textboxStyles = {
    width: "400px",
    height: "400px",
    display: "block"
}

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
        const newConfig = createConfig(this.selectedArray())
        return (
            <div style={styles}>
                {_.map(_.keys(features), (feature) => <div><input checked={this.state.selected[feature]} onClick={() => this.setSelected(feature)} type="checkbox" /> {feature}</div>)}
                <textarea style={textboxStyles} value={newConfig}>
                </textarea>
                </div>)

    }
}

const App = () => (
    <Configurator />
);

render(<App />, document.getElementById('app'));
