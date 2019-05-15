#!/usr/bin/env node
'use strict'

const modifyFiles = require('./utils').modifyFiles
const packageJson = require('../package.json')
const config = packageJson.config

modifyFiles(['./package.json', './cloudformation.yaml', './simple-proxy-api.yaml'], [{
  regexp: new RegExp(config.accountId, 'g'),
  replacement: 'YOUR_ACCOUNT_ID'
}, {
  regexp: new RegExp(config.region, 'g'),
  replacement: 'YOUR_AWS_REGION'
}, {
  regexp: new RegExp(config.s3BucketName, 'g'),
  replacement: 'AMAZON_CHIME_PRIVATE_BOT_LAMBDA_DEPLOY_BUCKET_NAME'
}, {
  regexp: new RegExp(config.functionName, 'g'),
  replacement: 'AMAZON_CHIME_PRIVATE_BOT_LAMBDA_FUNCTION_NAME'
}, {
  regexp: new RegExp(config.cloudFormationStackName, 'g'),
  replacement: 'AMAZON_CHIME_PRIVATE_BOT_LAMBDA_STACK_NAME'
}])
