#!/usr/bin/env node
'use strict'

const modifyFiles = require('./utils').modifyFiles
const packageJson = require('../package.json')
const config = packageJson.config

config.botIncomingWebhook = config.botIncomingWebhook.replace('?', '\\?');

modifyFiles(['./package.json', './cloudformation.yaml'], [
{
  regexp: new RegExp(config.connectArn, 'g'),
  replacement: 'AMAZON_CHIME_INBOUND_CALL_CONNECT_ARN'
}, {
  regexp: new RegExp(config.accountId, 'g'),
  replacement: 'YOUR_ACCOUNT_ID'
}, {
  regexp: new RegExp(config.region, 'g'),
  replacement: 'YOUR_AWS_REGION'
}, {
  regexp: new RegExp(config.s3BucketName, 'g'),
  replacement: 'AMAZON_CHIME_INBOUND_CALL_LAMBDA_DEPLOY_BUCKET_NAME'
}, {
  regexp: new RegExp(config.functionName, 'g'),
  replacement: 'AMAZON_CHIME_INBOUND_CALL_LAMBDA_FUNCTION_NAME'
}, {
  regexp: new RegExp(config.botIncomingWebhook, 'g'),
  replacement: 'AMAZON_CHIME_INBOUND_CALL_LAMBDA_BOT_INCOMING_WEBHOOK'
}, {
  regexp: new RegExp(config.userEmail, 'g'),
  replacement: 'AMAZON_CHIME_INBOUND_CALL_LAMBDA_USER_EMAIL'
}, {
  regexp: new RegExp(config.cloudFormationStackName, 'g'),
  replacement: 'AMAZON_CHIME_INBOUND_CALL_LAMBDA_STACK_NAME'
}])
