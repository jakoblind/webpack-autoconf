import React from 'react';
import { render } from 'react-dom';
import jsStringify from "javascript-stringify";
import _ from "lodash";
import prism from "prismjs";
import GetZip from "./GetZip";

import {
    features,
    createWebpackConfig,
    createBabelConfig,
    getNpmDependencies,
    getDefaultProjectName
} from "./configurator";

import FileBrowser from "./FileBrowser";

const Feature = ({feature, selected, setSelected}) => (
    <label className="feature-container">
            {feature}
            <input
                checked={selected || false}
                onClick={() => setSelected(feature)}
                type="checkbox" />
                <span className="checkmark"></span>
    </label>
);

class Features extends React.Component {
    render() {
        const { features, selected, setSelected } = this.props;
        const groupedFeatures = _.chain(features)
              .mapValues((v,k,o) => Object.assign({}, v, { feature: k }))
              .groupBy("group")
              .value();

        return (
            <div className="features">
                {_.map(groupedFeatures, (featureList, group) => (
                    <div className="feature-group" key={group}>
                        <div className="feature-group-name">
                            {group !== "undefined" ? group : ''}
                        </div>
                        <div className="feature-group-container">
                        {_.map(featureList, ({feature}) => (
                            <Feature
                                feature={feature}
                                selected={selected[feature]}
                                setSelected={setSelected}
                                key={feature}
                            />
                        ))}
                    </div>
                    </div>
                ))}

            </div>
        );
    }
}

const logFeatureClickToGa = (feature, selected) => {
    const eventAction = selected ? 'select' : 'deselect';
    window.gtag("event", eventAction, {
        "event_category": "features",
        "event_label": feature
    })
}

const logDownloadToGa = (filename) => {
    window.gtag("event", "download-zip", {
        "event_category": "created-project",
        "event_label": filename
    })
}

const Header = ({ selected, setSelected, showFeatures }) => {
    return (
        <div className="header">
            <h1>webpack 4 configurator</h1>
            <h2>Create a <i>personalized</i> and <i>optimized</i> webpack.config.js!</h2>

            <div >
                <div className="start-here">Start here! What features do you need?</div>
            </div>
            <Features
                features={showFeatures}
                selected={selected}
                setSelected={setSelected}/>
            </div>
    );
}

const Footer = () => (
    <div className="footer">
        <h3>What is this?  </h3>
        <p>
            When using this tool, you get a webpack.config.js that is created just for <i>you</i>. It's a great starting point for further development. The webpack.config.js will create an optimized bundle based on <a href="http://blog.jakoblind.no/3-ways-to-reduce-webpack-bundle-size/">best practices</a>. Advanced optimizations such as code splitting is not (yet?) supported with this tool.
        </p>
        <h4>Want more?</h4>
        <p>Want to be notified when I build more cool stuff like this? And also get early access to articles?</p>
        <a className="myButton" href="https://www.getdrip.com/forms/81916834/submissions/new">Sign up to my newsletter</a>
        <h4>Found a bug or want a feature?</h4>
        <p>Contact me on <a href="https://twitter.com/karljakoblind">twitter</a> or file an issue or even better make a PR on the <a href="https://github.com/jakoblind/webpack-configurator">github repo</a>. Yes this is open source.</p>
        <h4>Who made this thing?</h4>
        <p>
            It's me, Jakob who made this. I write <a href="http://blog.jakoblind.no">a blog about React</a> that you might want to check out if you liked this! I am also on <a href="https://twitter.com/karljakoblind">twitter</a>.
        </p>

    </div>
);

const StepByStepArea = ({features, newNpmConfig, newBabelConfig, isReact}) => {
    const npmInstallCommand = _.isEmpty(newNpmConfig.dependencies) ? "" : "\nnpm install " + newNpmConfig.dependencies.join(" ")
    const npmCommand = "mkdir myapp\ncd myapp\nnpm init -y\nnpm install --save-dev " + newNpmConfig.devDependencies.join(" ") + npmInstallCommand

    let babelStep = null;
    if (newBabelConfig) {
        babelStep = <div><li>Create <i>.babelrc</i> in the root and copy the contents of the generated file</li></div>;
    }

    let srcFoldersStep = <li>Create folders src and dist and create your index.js file in src folder</li>;
    if (isReact) {
        srcFoldersStep = <li>Create folders src and dist and create your <a href="https://s3-eu-west-1.amazonaws.com/jakoblind/react/index.js">index.js</a> file in src folder and <a href="https://s3-eu-west-1.amazonaws.com/jakoblind/react/index.html">index.html</a> in the dist folder</li>;
    }

    return (
        <div className="right-section">
             <h3>How to create your project yourself</h3>
             <ol>
             <li>Create an NPM project and install dependencies</li>
             <textarea readOnly={true} rows="6" cols="50" value={npmCommand}/>

             <li>Create <i>webpack.config.js</i> in the root and copy the contents of the generated file</li>

             { babelStep }
             { srcFoldersStep }
             </ol>
            <a href="http://blog.jakoblind.no/react-with-webpack-babel-npm/">Need more detailed instructions?</a>
        </div>
    )
}

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: { } }
        this.setSelected = this.setSelected.bind(this);
    }
    setSelected(feature) {
        const setToSelected = !this.state.selected[feature]
        logFeatureClickToGa(feature, setToSelected);
        const selected = Object.assign(
            {},
            this.state.selected,
            { [feature]: setToSelected }
        );

        // only possible to select one of Vue or React. Needing both is an edge case
        // that is probably very rare. It adds much complexity to support both.
        if (feature === "Vue" && setToSelected) {
            selected["React"] = !setToSelected;
            selected["React hot loader"] = false;
            selected["CSS"] = true;
        } else if (feature === "React" && setToSelected) {
            selected["Vue"] = !setToSelected;
            // let's default react hot loader
            selected["React hot loader"] = true;
        } else if (feature === "React" && !setToSelected) {
            // cant have React hot loader without React
            selected["React hot loader"] = false;
        }

        this.setState({ selected });
    }
    selectedArray(){
        return _.chain(this.state.selected).map((v, k) => v ? k : null).reject(_.isNull).value();
    }
    render() {
        const newWebpackConfig = createWebpackConfig(this.selectedArray());
        const newBabelConfig = createBabelConfig(this.selectedArray());
        const newNpmConfig = getNpmDependencies(this.selectedArray());

        const isReact = _.includes(this.selectedArray(), "React");
        const isVue = _.includes(this.selectedArray(), "Vue");

        const projectname = getDefaultProjectName("empty-project", this.selectedArray());

        const showFeatures = _.clone(features);

        if (!isReact) {
            delete showFeatures["React hot loader"];
        }
        return (
            <div>
                <Header
                    selected={this.state.selected}
                    setSelected={this.setSelected}
                    showFeatures={showFeatures}/>
                <div className="container">
                    <div className="download-zip">
                        { !isVue ? <GetZip onClickDownloadZip={this.onClickDownloadZip} projectname={projectname} /> : null }
                    </div>
                    <FileBrowser
                        newBabelConfig={newBabelConfig}
                        newWebpackConfig={newWebpackConfig}
                        features={this.selectedArray()}
                        newNpmConfig={newNpmConfig}/>
                    <StepByStepArea
                        features={this.selectedArray()}
                        newNpmConfig={newNpmConfig}
                        newBabelConfig={newBabelConfig}
                        isReact={isReact}/>
                </div>
                <Footer/>
            </div>)
    }
}

const App = () => (
    <Configurator />
);

render(<App />, document.getElementById('app'));
