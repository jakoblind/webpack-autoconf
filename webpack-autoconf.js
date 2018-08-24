import _ from "lodash";

import jsStringify from "javascript-stringify";
import combinations from "combinations";
import fetch from "node-fetch";
import Promise from "bluebird";

import fs from "fs";
import childProcess from "child_process";

import { features, createWebpackConfig, createBabelConfig, getNpmDependencies, getDefaultProjectName, getPackageJson } from "./src/configurator";
import { readmeFile } from "./src/templates";
import { reactIndexJs, reactHotIndexJs, reactIndexHtml } from "./static/react/index";
import { emptyIndexJs } from "./static/empty/index";
import {indexTypescriptHTML, tsconfig, tsconfigReact} from "./static/ts";
import {vueHelloWorldJs, vueHelloWorldTS, vueIndexAppVue, vueIndexHtml, vueIndexTs, vueShimType} from "./static/vue";

function exec(command) {
    return new Promise(function(resolve, reject) {
        childProcess.exec(command, function(error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            resolve({stdout, stderr});
        });
    });
}

function getFeatureCombinations() {
    const allFeatures = _.keys(features);
    const notSupportedFeatures = ["Vue"];

    const featuresCombinations = _.reject(allFeatures, feature => _.includes(notSupportedFeatures, feature));

    return combinations(featuresCombinations);
}

const nodeVersionMap = {};
function getNodeVersionPromise(name) {
    if (nodeVersionMap[name]) {
        return nodeVersionMap[name];
    }
    // TODO: error handling!
    return exec(`npm show ${name} version`).then(({stdout}) => {
        const version = "^" + stdout.replace(/\n$/, "")
        nodeVersionMap[name] = version;
        return version;
    });
}


function writeFile(path, content) {
    fs.writeFileSync(path, content);
}

function mkDir(path) {
    if (path && !fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function generateProject(requestedFeatures, { basePath, name }) {
    const isReact = _.includes(requestedFeatures, "React");
    const isVue = _.includes(requestedFeatures, "Vue");
    const isTypescript = _.includes(requestedFeatures, "Typescript");
    const isHotReact = _.includes(requestedFeatures, "React hot loader");
    const indexSuffix = isTypescript ? 'ts' : 'js';

    if (isVue) {
        requestedFeatures.push('CSS');
    }

    if (isHotReact && !isReact) {
        console.log("Cannot configure React hot loading without configuring React");
        return;
    }

    const projectName = name || getDefaultProjectName("empty-project", requestedFeatures);
    const fullPath = (basePath || ".") + "/" + projectName + "/"

    const newNpmConfig = getNpmDependencies(requestedFeatures);
    const newWebpackConfig = createWebpackConfig(requestedFeatures);
    const newBabelConfig = createBabelConfig(requestedFeatures);

    console.log("Generating " + projectName + "...");

    mkDir(basePath);
    mkDir(fullPath);

    writeFile(fullPath + "webpack.config.js", newWebpackConfig);
    writeFile(fullPath + "README.md", readmeFile(projectName, isReact, isHotReact));

    if (newBabelConfig && isReact) {
        writeFile(fullPath + ".babelrc", newBabelConfig);
    }

    mkDir(fullPath + "src");

    if (isVue){
        writeFile(`${fullPath}/src/App.vue`, isTypescript ? vueHelloWorldTS: vueIndexAppVue);
        writeFile(`${fullPath}/src/Hello.vue`, isTypescript ? vueHelloWorldTS: vueHelloWorldJs);
    }

    if(isVue && isTypescript){
        writeFile(`${fullPath}vue-shim.d.ts`, vueShimType);
    }

    if (isReact || isVue) {
        mkDir(fullPath + "dist");
        const INDEX_REACT = isHotReact ? reactHotIndexJs : reactIndexJs;

        writeFile(`${fullPath}src/index.${indexSuffix}`, isReact ? INDEX_REACT : vueIndexTs);
        writeFile(fullPath + "dist/index.html", isVue ? vueIndexHtml : reactIndexHtml);
        if (isTypescript) {
            writeFile(`${fullPath}tsconfig.json`, tsconfigReact);
        }
    } else if (isTypescript) {
        mkDir(fullPath + "dist");
        writeFile(fullPath + "dist/index.html", indexTypescriptHTML);
        writeFile(`${fullPath}src/index.${indexSuffix}`, emptyIndexJs);
        writeFile(`${fullPath}tsconfig.json`, tsconfig);
    } else {
        writeFile(`${fullPath}src/index.${indexSuffix}`, emptyIndexJs);
    }

    return getPackageJson("empty-project-"+_.kebabCase(requestedFeatures), newNpmConfig.dependencies, newNpmConfig.devDependencies, getNodeVersionPromise, requestedFeatures)
        .then((newPackageJson) => {
            writeFile(fullPath + "package.json", JSON.stringify(newPackageJson, null, 2));
            console.log("Done generating " + projectName + "!");
            return projectName;
        });

}
// TODO: check if all of requestedFeatures are supported
const [a, b, command, name, ...requestedFeatures] = process.argv;

if (command === "new") {
    generateProject(requestedFeatures, {name});
} else if (command === "all") {
    // for some reason Promise.reduce ignores the first item in the list so we add one extra empty feature [[]]
    const combinations = _.concat([[]], [[]], getFeatureCombinations());

    Promise.reduce(combinations, (_, features) => {
        return generateProject(features, {basePath: "generated"})
    })
} else {
    console.log("Usage: webpack-autoconf new [project-name] [features]");
    console.log("");
    console.log("Where [features] can be any combination of:");
    _.forEach(_.keys(features), feature => console.log("  - "+feature))
    console.log("");
    console.log("Example: webpack-autoconf new myProject React PNG");
    console.log("");
}
