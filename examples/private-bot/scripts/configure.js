#!/usr/bin/env node
'use strict'

const modifyFiles = require('./utils').modifyFiles
const yargs = require('yargs')
const argv = yargs.options({
	accountId: {
    demand: true,
    alias: 'account-id',
    describe: 'aws account id',
    string: true
	},
  bucketName: {
    demand: true,
    alias: 'bucket-name',
    describe: 'S3 bucket used to deploy lambda',
    string: true
  },
  functionName: {
    alias: 'function-name',
    describe: 'Lambda function name',
    string: true,
    default: 'AmazonChimePrivateBot'
  },
  cloudFormationStackName: {
    alias: 'cloudformation-stack-name',
    describe: 'CloudFormation stack name',
    string: true,
    default: 'AmazonChimePrivateBotLambdaStack'
  },
  region: {
    alias: 'region',
    describe: 'AWS Region demo uses',
    string: true,
    default: 'us-east-1'
  }
}).argv;

modifyFiles(['./package.json', './cloudformation.yaml', './simple-proxy-api.yaml'], [{
  regexp: /YOUR_ACCOUNT_ID/g,
  replacement: argv.accountId
}, {
  regexp: /YOUR_AWS_REGION/g,
  replacement: argv.region
}, {
  regexp: /AMAZON_CHIME_PRIVATE_BOT_LAMBDA_DEPLOY_BUCKET_NAME/g,
  replacement: argv.bucketName
}, {
  regexp: /AMAZON_CHIME_PRIVATE_BOT_LAMBDA_FUNCTION_NAME/g,
  replacement: argv.functionName
}, {
  regexp: /AMAZON_CHIME_PRIVATE_BOT_LAMBDA_STACK_NAME/g,
  replacement: argv.cloudFormationStackName
}])
