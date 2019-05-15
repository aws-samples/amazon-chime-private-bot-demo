## Example

The `example` directory includes a [Swagger file](http://swagger.io/specification/), [CloudFormation template](https://aws.amazon.com/cloudformation/aws-cloudformation-templates/) with [Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model), and helper scripts to help you set up and manage your application.

### Steps for running the example
This guide assumes you have already [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html) and have the latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed.

Configure AWS CLI with AWS credentials.

#### Create Lambda function to handle bot event
  1. From your preferred project directory: `git clone https://github.com/aws-samples/amazon-chime-private-bot-demo.git && cd amazon-chime-private-bot-demo/examples/private-bot`.
  2. Run `npm run config -- --account-id=<accountId> --bucket-name=<bucketName> --function-name=<functionName> --cloudformation-stack-name=<stack_name>` to configure the example.

  eg. `npm run config -- --account-id="123456789012" --bucket-name="my-unique-bucket" --function-name="myFunction" --cloudformation-stack-name="AmazonChimePrivateBotLambdaStack"`

  This modifies `package.json` and `cloudformation.yaml` with your account ID, bucket, region and function name (region defaults to `us-east-1` and function name defaults to `AmazonChimePrivateBot`). If the bucket you specify does not yet exist, the next step will create it for you. This step modifies the existing files in-place; if you wish to make changes to these settings, you will need to modify `package.json` and `cloudformation.yaml` manually.
  3. Run `npm run setup` - this installs the node dependencies, creates an S3 bucket (if it does not already exist), packages and deploys example lambda to handle bot event and create API Gateway to provides an HTTP endpoint for Chime to invoke Lambda function.
  4. Copy http url from [API Gateway AWS console](https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis/<api>/stages/<stage>), http url will be used when setup bot.

#### Setup Chime Bot
  1. Create Chime Bot through AWS CLI
  eg. `aws chime create-bot --account-id "<account_id>" --display-name "<bot_name>" --domain "<domain_name>"``

  botId from Response is used in the next step to put events configuration
  bot email is used to invite bot to chat room.

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

#### Interact with Bot via @mention message
- Help： `@<bot_name> help`
- check-inventory: `@<bot_name> check-inventory help`
- find-in-store: `@<bot_name> find-in-store help`

#### Clean up:
  1. Run `npm run deconfig`, it resets project parameters.

## Node.js version

This example was written against Node.js version 8.10
