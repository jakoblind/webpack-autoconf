import React from 'react';
import { render } from 'react-dom';
import jsStringify from "javascript-stringify";
import _ from "lodash";
import { features, createWebpackConfig, createBabelConfig, getNpmModules } from "./configurator";

import prism from "prismjs";

const Features = ({features, selected, setSelected}) => <div className="features">
      {_.map(_.keys(features), (feature) => <label className="feature-container">{feature}<input checked={selected[feature]} onClick={() => setSelected(feature)} type="checkbox" /><span class="checkmark"></span></label>)}
</div>

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: { } }
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
        const newWebpackConfig = createWebpackConfig(this.selectedArray());
        const newBabelConfig = createBabelConfig(this.selectedArray());
        const newNpmConfig = getNpmModules(this.selectedArray());

        const highlightedWebpackConfig = () => {
            return {
                __html: Prism.highlight(newWebpackConfig, Prism.languages.javascript, 'javascript')
            };
        };

        const npmCommand = "npm install --save-dev " + newNpmConfig.join(" ")

        return (
            <div>
                <div className="header">
                    <h1>webpack configurator</h1>
                    <h2>Create a <i>personalized</i> and <i>optimized</i> webpack.config.js!</h2>

                    <div >
                        <div className="start-here">Start here! What features do you need?</div>
                    </div>
                    <Features features={features} selected={this.state.selected} setSelected={this.setSelected}/>
                </div>
                <div className="container">
                    <div className="left-section">
                        <h3>Your personal webpack.config.js</h3>
                        <pre><code className="language-css" dangerouslySetInnerHTML={highlightedWebpackConfig()}></code></pre>
                    </div>
                    <div className="right-section">
                        <h3>Create your project in 4 easy steps!</h3>
                        <h4>1. Create an NPM project and install dependencies</h4>
                        <textarea readOnly={true} rows="6" cols="50" value={npmCommand}/>

                        <h4>2. Create webpack.config.js in the root and copy the contents of the generated file</h4>

                        <h4>3. Create folders src and dist and create your index.js file in src folder</h4>
                        {newBabelConfig ? <div><h4>4. You will also need this .babel.rc file</h4>
                            <textarea readOnly={true} rows="5" cols="50" value={newBabelConfig}/></div> : null}

                        <p>Need more detailed instructions?</p>
                    </div>
                </div>

                <div className="footer">
                    <h3>What is this?  </h3>
                    <p>
                        When using this tool, you get a webpack.config.js that is created just for <i>you</i>. It's a great starting point for further development. The webpack.config.js will create an optimized bundle based on <a href="http://blog.jakoblind.no/3-ways-to-reduce-webpack-bundle-size/">best practices</a>. Advanced optimizations such as code splitting is not (yet?) supported with this tool.
                        <h4>Want more?</h4>
                        <p>Want to be notified when I build more cool stuff like this? And also get early access to articles? Sign up to my newsletter </p>
                        <h4>Found a bug or want a feature?</h4>
                        <p>Contact me on <a href="https://twitter.com/karljakoblind">twitter</a> or file an issue or even better make a PR on the <a href="https://github.com/jakoblind/webpack-configurator">github repo</a>. Yes this is open source.</p>
                        <h4>Who made this thing?</h4>
                        <p>
                            It's me, Jakob who made this. I write <a href="http://blog.jakoblind.no">a blog about React</a> that you might want to check out if you liked this! I am also on <a href="https://twitter.com/karljakoblind">twitter</a>.
                        </p>
                    </p>
                </div>

            </div>)

    }
}

const App = () => (
    <Configurator />
);

render(<App />, document.getElementById('app'));
