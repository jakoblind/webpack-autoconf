const AWS = require('aws-sdk');
const _ = require('lodash');

const s3 = new AWS.S3();
const srcBucket = 'https://s3-eu-west-1.amazonaws.com/jakoblind/';

AWS.config.update({
  accessKeyId: 'YOUR_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
  'region': 'eu-west-1'
});


exports.handler = function(event, context, returnCb) {
  const params = event.queryStringParameters ? _.mapValues(event.queryStringParameters, (value) => typeof value === 'string' ? value.toLowerCase() : '') : {};

  const baseProjectLib = (params['main-library'] === 'react' || params['main-library'] === 'vue') ? params['main-library'] : '';
  const transpilers = getTranspilersFromParams(params);
  const styling = getAvailablesValuesFromParams(params.styling, ['css', 'css-modules', 'sass', 'less']);
  const images = getAvailablesValuesFromParams(params.image, ['svg', 'png']);
  const utilities = getAvailablesValuesFromParams(params.utilities, ['lodash', 'moment']);
  const optimizations = getOptimizationFromParams(params, transpilers);

  const features = _.concat(_.sortBy(_.concat(transpilers, styling, images, optimizations, baseProjectLib)), utilities);
  const srcKey = `empty-project-${ _.kebabCase(features)}.zip`;

  s3.getObject({
    Bucket: srcBucket,
    Key: srcKey
  }).promise()
  .then(function sendBack(err, data) {
    let response;
    if(err) {
      returnCb(null, {
        statusCode: 404,
        body: 'Project unreachable'
      });
      return;
    }
    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-type' : 'application/zip',
        'Content-Disposition': `attachment; filename=${filename}`
      },
      body: data.Body,
    };
    returnCb(null, response);
  });
};

function getTranspilersFromParams(params) {
  const transpilerParams = params.transpiler ? params.transpiler.split(',') : [];
  const transpilers = [];
  if(transpilerParams.includes('babel')) {
    transpilers.push('babel');
  }
  if(transpilerParams.includes('typescript')) {
    transpilers.push('typescript');
  }
  if(!transpilers.length && params['main-library'] === 'react') {
    transpilers.push('babel');
  }
  return transpilers;
}

function getOptimizationFromParams(params, transpilers) {
  const optiParams = params.optimization ? params.optimization.split(',') : [];
  const optis = [];
  if(optiParams.includes('code-split-vendors')) {
    optis.push('code-split-vendors');
  }
  if(optiParams.includes('react-hot-loader') && params['main-library'] === 'react' && !transpilers.includes('typescript')) {
    optis.push('react-hot-loader');
  }
  return optis;
}

function getAvailablesValuesFromParams(param, availableValues) {
  const valuesParam = param ? param.split(',') : null;
  if(!valuesParam) {
    return [];
  }
  return availableValues.filter((availableParam) => valuesParam.includes(availableParam));
}



