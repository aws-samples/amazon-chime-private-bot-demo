## Example

This example creates a serverless application for an outdoor store contact center. Amazon Connect contact flow integrates Lex bot to collect basic customer information. Amazon Connect then invoke a lambda function look up sales associate's business calling number. At the end Amazon Connect forwards the call to corresponding sales associate.

The `example` directory includes a [Swagger file](http://swagger.io/specification/), [CloudFormation template](https://aws.amazon.com/cloudformation/aws-cloudformation-templates/) with [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model), and helper scripts to help you set up and manage your application.

### Steps for running the example
This guide assumes you have already [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html) and have the latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed.

Configure AWS CLI with AWS credentials.

#### Setup Chime Bot
  1. Create Chime Bot through AWS CLI
  eg. `aws chime create-bot --account-id "<account_id>" --display-name "<bot_name>" --domain "<domain_name>"``

  botId from Response is used in the next step to put events configuration. BotEmail is used to invite bot to chat room.

  e.g.
  `    "Bot": {
        "CreatedTimestamp": "<timeStamp>",
        "DisplayName": "ExampleBot",
        "Disabled": false,
        "UserId": "<userId>",
        "BotId": "<botId>",
        "UpdatedTimestamp": "<timeStamp>",
        "BotType": "ChatBot",
        "SecurityToken": "<securityToken>",
        "BotEmail": "<botEmail>"
  `

  2. Setup Chime bot event configuration to use http endpoint created by Chime private bot, see private bot example.
  eg. `aws chime put-events-configuration --account-id "<account_id>" --bot-id "<bot_id>" --outbound-events-https-endpoint "<http_endpoint>"`
  3. Invite Chime bot to a chat room, bot will show incoming webhook url to use later.

#### Setup Amazon Connect and Lex bot
  1. Create Amazon Lex bot to collect customer basic information, [How to Create a Custom Amazon Lex Bot](https://docs.aws.amazon.com/lex/latest/dg/getting-started-ex2.html)
    - Product name customer wants to buy
    - Customer name
    - Customer zip code
  2. Create Amazon Connect instance and provision a phone number.
  3. Create Contact flows including Lex bot, invoke Lambda and transfer to Chime business calling number

  Note: Import sample Amazon Connect contact flow by using sample file provided sample_contact_flow [How to import Amazon Connect contact flow](https://docs.aws.amazon.com/connect/latest/userguide/contactflow.html#contact-flow-import-export).

#### Create Lambda function
  1. From your preferred project directory: `git clone https://github.com/aws-samples/amazon-chime-private-bot-demo.git && cd amazon-chime-private-bot-demo/examples/inbound-call`.
  2. Run `npm run config -- --account-id=<accountId> --bucket-name=<bucketName> --function-name=<functionName> --user-email=<email> --bot-incoming-webhook="<botIncomingWebhook>" --connect-arn="<connectArn>" --cloudformation-stack-name="<cloudformationStackName>"` to configure the example.

  eg. `npm run config -- --account-id="123456789012" --bucket-name="my-unique-bucket" --function-name="myFunction" --user-email="example@email.com" --bot-incoming-webhook="http://example.incomingwebhook" --connect-arn="arn:aws:lambda:us-east-1:accountId:arn" --cloudformation-stack-name="AmazonChimeInboundCallLambdaStack"`

  This modifies `package.json` and `cloudformation.yaml` with your account ID, bucket, region and function name (region defaults to `us-east-1` and function name defaults to `AmazonChimeDemoInboundCall`). If the bucket you specify does not yet exist, the next step will create it for you. This step modifies the existing files in-place; if you wish to make changes to these settings, you will need to modify `package.json` and `cloudformation.yaml` manually.

  3. Run `npm run setup` - this installs the node dependencies, creates an S3 bucket (if it does not already exist), packages and deploys example inbound call forwarding application to AWS Lambda and allow Amazon Connect to invoke lambda.

#### Update Amazon Connect contact flow Lambda
  1. Update Amazon Connect with Lambda function created in previous step.

#### Clean up:
  1. Run `npm run deconfig`, it resets project parameters.

## Node.js version

This example was written against Node.js version 8.10
