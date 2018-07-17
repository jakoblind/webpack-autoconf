import React from 'react';
import _ from "lodash";

import {
    getPackageJson,
    getDefaultProjectName
} from "./configurator";

import {
    reactIndexJs,
    reactHotIndexJs,
    reactIndexHtml
} from "./../static/react/index";

import { emptyIndexJs } from "./../static/empty/index";
import { readmeFile } from "./templates";

const FileList = ({ files, selectedFile, onSelectFile }) => {
    const filesElements = _.map(files, (file) => <li className={file === selectedFile ? "selected" : "" } key={file} onClick={() => onSelectFile(file)}>{file}</li>)

    return (
        <div className="files">
            <ul>
                {filesElements}
            </ul>
        </div>
    )
};

const CodeBox = ({ code }) => {
    const highlightedCode = () => {
        return {
            __html: Prism.highlight(code, Prism.languages.javascript, 'javascript')
        };
    };

    return (
        <pre id="code-box">
            <code className="language-css" dangerouslySetInnerHTML={highlightedCode()}></code>
        </pre>
    );
}

class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: props.defaultSelection
        };
        this.setSelectedFile = this.setSelectedFile.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.fileContentMap !== prevProps.fileContentMap) {
            if (!_.includes(_.keys(this.props.fileContentMap), this.state.selectedFile)) {
                this.setState({ selectedFile: this.props.defaultSelection });
            }
        }
    }
    setSelectedFile(selectedFile) {
        this.setState({ selectedFile });
    }
    render() {
        const { fileContentMap } = this.props;
        const content = _.get(fileContentMap, this.state.selectedFile, "");

        var extensionRegex=/\.[0-9a-z]+$/i;
        const extension = this.state.selectedFile.match(extensionRegex);
        return (
            <div className="file-browser">
                <FileList
                    selectedFile={this.state.selectedFile}
                    files={_.keys(fileContentMap)}
                    onSelectFile={this.setSelectedFile}/>
                <CodeBox
                    extension={extension}
                    code={content}/>
            </div>
        );
    }
}

class FileBrowserContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            packageJson: ""
        };
        this.updatePackageJson = this.updatePackageJson.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.newNpmConfig !== prevProps.newNpmConfig) {
            this.updatePackageJson();
        }
    }
    updatePackageJson() {
        this.setState({
            packageJson: "// fetching dependency versions..."
        })

        const getNodeVersionPromise = (name) => {
            return fetch(`https://unpkg.com/${name}/package.json`)
                .then(res => res.json())
                .then(r => {
                    return "^" + r.version;
                });
        }
        const { newNpmConfig, features } = this.props;
        getPackageJson(
            getDefaultProjectName("empty-project", features),
            newNpmConfig.dependencies,
            newNpmConfig.devDependencies,
            getNodeVersionPromise,
            features
        ).then((packageJson) =>
               this.setState({ packageJson }));
    }
    componentDidMount() {
        this.updatePackageJson();
    }
    render() {
        const {
            newNpmConfig,
            features,
            newWebpackConfig,
            newBabelConfig,
            packageJson
        } = this.props;

        const isReact = _.includes(features, "React");
        const isHotReact = _.includes(this.props.features, "React hot loader");

        const reactFileNames = [
            "dist/index.html",
            "src/index.js"
        ];

        const filesToShow = _.concat(
            ["webpack.config.js", "package.json", "README.md", "src/index.js"],
            newBabelConfig ? ".babelrc" : [],
            isReact ? reactFileNames : []);

        let indexJsFile = emptyIndexJs;

        if (isReact){
            if (isHotReact) {
                indexJsFile = reactHotIndexJs;
            } else {
                indexJsFile = reactIndexJs;
            }
        }

        const completeFileContentMap = {
            "webpack.config.js": newWebpackConfig,
            "package.json": JSON.stringify(this.state.packageJson, null, 2),
            "dist/index.html": reactIndexHtml,
            "src/index.js": indexJsFile,
            ".babelrc": newBabelConfig,
            "README.md": readmeFile("empty-project", isReact, isHotReact)
        };

        const fileContentMap = _.pickBy(completeFileContentMap, (value, fileName) => _.includes(filesToShow, fileName));

        return (
            <FileBrowser
                defaultSelection={"webpack.config.js"}
                fileContentMap={fileContentMap} />
        );
    }
}

export default FileBrowserContainer;
