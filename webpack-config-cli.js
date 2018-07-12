import _ from "lodash";

import jsStringify from "javascript-stringify";
import combinations from "combinations";
import fetch from "node-fetch";
import Promise from "bluebird";

import fs from "fs";
import childProcess from "child_process";

import {features, createWebpackConfig, createBabelConfig, getNpmDependencies, getDefaultProjectName} from "./src/configurator";
import { packageJson, readmeFile } from "./src/templates";

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
        const version = stdout.replace(/\n$/, "")
        nodeVersionMap[name] = version;
        return version;
    });
}

function getPackageJson(name, dependenciesNames, devDependenciesNames) {
    const dependenciesVersionsPromises = _.map(dependenciesNames, getNodeVersionPromise);
    const devDependenciesVersionsPromises = _.map(devDependenciesNames, getNodeVersionPromise);
    let dependenciesVersions;
    return Promise.all(dependenciesVersionsPromises).then((response) => {
        dependenciesVersions = response;
        return Promise.all(devDependenciesVersionsPromises)
    }).then((devDependenciesVersions) => {
        const dependencies = _.zipObject(dependenciesNames, dependenciesVersions);
        const devDependencies = _.zipObject(devDependenciesNames, devDependenciesVersions);

        return Object.assign({}, packageJson, {dependencies}, {devDependencies}, {name});
    })
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
    const projectName = name || getDefaultProjectName("empty-project", requestedFeatures);
    const fullPath = (basePath || ".") + "/" + projectName + "/"

    const newNpmConfig = getNpmDependencies(requestedFeatures);
    const newWebpackConfig = createWebpackConfig(requestedFeatures);
    const newBabelConfig = createBabelConfig(requestedFeatures);
    const isReact = _.includes(requestedFeatures, "React")

    console.log("Generating " + projectName + "...");

    mkDir(basePath);
    mkDir(fullPath);

    writeFile(fullPath + "webpack.config.js", newWebpackConfig);
    writeFile(fullPath + "README.md", readmeFile(projectName, isReact));

    if (newBabelConfig) {
        writeFile(fullPath + ".babelrc", newBabelConfig);
    }

    let reactFilesPromise = Promise.resolve()

    mkDir(fullPath + "src");

    if (isReact) {
        mkDir(fullPath + "dist");

        fs.createReadStream('./static/react/index.js').pipe(fs.createWriteStream(fullPath + 'src/index.js'));
        fs.createReadStream('./static/react/index.html').pipe(fs.createWriteStream(fullPath + 'dist/index.html'));
        /* TODO: implement this as a backup solution if local files does not exist
           reactFilesPromise = fetch("https://s3-eu-west-1.amazonaws.com/jakoblind/react/index.js") // //
           .then(res => res.text()) //
           .then(content => writeFile(fullPath + "src/index.js", content)) //
           .then(() => fetch("https://s3-eu-west-1.amazonaws.com/jakoblind/react/index.html")) //
           .then(res => res.text()) //
           .then(content => writeFile(fullPath + "dist/index.html", content))*/
    } else {
        fs.createReadStream('./static/empty/index.js').pipe(fs.createWriteStream(fullPath + 'src/index.js'));
    }

    return reactFilesPromise
        .then(() => getPackageJson("empty-project-"+_.kebabCase(requestedFeatures), newNpmConfig.dependencies, newNpmConfig.devDependencies)) .then((newPackageJson) => {
            writeFile(fullPath + "package.json", JSON.stringify(newPackageJson, null, 2));
            console.log("Done generating " + projectName + "!");
            return projectName;
        });

}
// TODO: check if all of requestedFeatures are supported
const [a, b, command, name, ...requestedFeatures] = process.argv;

if (command === "help"){
    console.log("Usage: node ./webpack-config-cli.js [command] [name] [features]");
    console.log("");
    console.log("Commands:");
    console.log("  new\tcreate a new project with [name] using [features]");
    console.log("  all\tgenerate all possible combinations of projects in 'generated' folder.");
} else if (command === "new") {
    generateProject(requestedFeatures, {name});
} else if (command === "all") {
    // for some reason Promise.reduce ignores the first item in the list so we add one extra empty feature [[]]
    const combinations = _.concat([[]], [[]], getFeatureCombinations());

    Promise.reduce(combinations, (_, features) => {
        return generateProject(features, {basePath: "generated"})
    })
}
