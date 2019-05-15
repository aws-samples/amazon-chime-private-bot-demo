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
    default: 'AmazonChimeDemoInboundCall'
  },
  botIncomingWebhook: {
    demand: true,
    alias: 'bot-incoming-webhook',
    describe: 'Incoming webhook url of bot',
    string: true
  },
  userEmail: {
    demand: true,
    alias: 'user-email',
    describe: 'Chime user email Lambda use to look up business calling number',
    string: true,
  },
  connectArn: {
    demand: true,
    alias: 'connect-arn',
    describe: 'Amazon Connect arn',
    string: true
  },
  cloudFormationStackName: {
    alias: 'cloudformation-stack-name',
    describe: 'CloudFormation stack name',
    string: true,
    default: 'AmazonChimeInboundCallLambdaStack'
  },
  connectArn: {
    demand: true,
    alias: 'connect-arn',
    describe: 'Amazon Connect arn',
    string: true
  },
  region: {
    alias: 'region',
    describe: 'AWS Region demo uses',
    string: true,
    default: 'us-east-1'
  }
}).argv;

modifyFiles(['./package.json', './cloudformation.yaml'], [{
  regexp: /YOUR_ACCOUNT_ID/g,
  replacement: argv.accountId
}, {
  regexp: /YOUR_AWS_REGION/g,
  replacement: argv.region
}, {
  regexp: /AMAZON_CHIME_INBOUND_CALL_LAMBDA_DEPLOY_BUCKET_NAME/g,
  replacement: argv.bucketName
}, {
  regexp: /AMAZON_CHIME_INBOUND_CALL_LAMBDA_FUNCTION_NAME/g,
  replacement: argv.functionName
}, {
  regexp: /AMAZON_CHIME_INBOUND_CALL_LAMBDA_BOT_INCOMING_WEBHOOK/g,
  replacement: argv.botIncomingWebhook
}, {
  regexp: /AMAZON_CHIME_INBOUND_CALL_LAMBDA_USER_EMAIL/g,
  replacement: argv.userEmail
}, {
  regexp: /AMAZON_CHIME_INBOUND_CALL_CONNECT_ARN/g,
  replacement: argv.connectArn
}, {
  regexp: /AMAZON_CHIME_INBOUND_CALL_LAMBDA_STACK_NAME/g,
  replacement: argv.cloudFormationStackName
}])
