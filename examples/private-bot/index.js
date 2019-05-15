// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const util = require('util');
const BotCommandHanlder = require('./bot_command_handler');

const EVENT_TYPE_CHIME_BOT_OUTBOUND_ENDPOINT_VERIFICATION = "HTTPSEndpointVerification";
const EVENT_TYPE_MENTION = "Mention";
const EVENT_TYPE_INVITE = "Invite";

const handle = async (event, context) => {
  try {
    const payload = getRequestBody(event);
    if (!payload) {
      const error = new Error("Payload is empty");
      error.statusCode = 400;
      throw error;
    }
    switch (payload.EventType) {
      case EVENT_TYPE_CHIME_BOT_OUTBOUND_ENDPOINT_VERIFICATION:
        return handleBotVerification(payload.Challenge);
        break;
      case EVENT_TYPE_MENTION:
        await handleMention(payload);
        break;
      case EVENT_TYPE_INVITE:
        await handleInvite(payload);
        break;
      default:
        const error = new Error("Invalid event type");
        error.statusCode = 400;
        throw error;
    }
    return {
      statusCode: 200
    }
  } catch (error) {
    console.log(`Failed with error = ${error}, event = ${JSON.stringify(event)}`);
    return {
      statusCode: error.statusCode || 500,
      error: `${error}`
    };
  }
};

const getRequestBody = (event) => {
  try {
    if (!event || !event.body) {
      return event;
    }
    const payload  = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : null).toString();
    return JSON.parse(payload);
  } catch (error) {
    console.log(`Failed to parse body, error = ${error}, event = ${util.inspect(event)}`);
    return null;
  }
};

const handleBotVerification = (securityToken) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      Challenge: securityToken
    }),
    headers: {
        'Content-Type': 'application/json',
    }
  };
};

const handleInvite = async (event) => {
  if (event && event.InboundHttpsEndpoint && event.InboundHttpsEndpoint.Url) {
    await BotCommandHanlder.notifyRoom(event.InboundHttpsEndpoint.Url, `Hello, welcome to the room, my webhook is ${event.InboundHttpsEndpoint.Url}`);
  }
}

const handleMention = async (event) => {
    await BotCommandHanlder.handle(event);
};

exports.handler = handle;
