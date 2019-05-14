// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const requestPromise = require('request-promise');
const AWS = require('aws-sdk');

const CUSTOMER_NAME_KEY = 'CustomerName';
const PRODUCT_NAME_KEY = 'ProductName';
const ZIP_CODE_KEY = 'CustomerZipCode';

const chime = new AWS.Chime({endpoint: 'service.chime.aws.amazon.com.'});

const handleInboundCall = async (event, context) => {
    try {
      const email = process.env.Email;
      const incomingwebhook = process.env.IncomingWebhook;
      const user = await getUser(email);
      const notificationMessage = buildNotification(event, user);
      await notifyRoom(incomingwebhook, notificationMessage);
      return {
          'OutboundNumber': user.PrimaryProvisionedNumber
      };
    } catch (err) {
      console.log(`Cannot forward call to business calling number, error = ${err}`);
      throw err;
    }
};

const buildNotification = (event, user) => {
  let customerName = getAttribute(event, CUSTOMER_NAME_KEY);
  const productName = getAttribute(event, PRODUCT_NAME_KEY);
  const zipCode = getAttribute(event, ZIP_CODE_KEY);
  const customerPhoneNumber = getContactData(event).CustomerEndpoint.Address;
  return `
    Received customer call, redirecting to <@${user.UserId}|${user.DisplayName}>
    Name: ${capitalize(customerName)}
    Product interested: ${capitalize(productName)}
    Zip code: ${zipCode}
    Phone Number: ${customerPhoneNumber}`
}

const capitalize = (input) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

const getContactData = (event) => event.Details.ContactData;

const getAttribute = (event, attributeName) => {
  try {
    const contactData = getContactData(event);
    return contactData.Attributes[attributeName];
  } catch (error) {
    console.log(`Cannot find ${attributeName}, error = ${error}`);
    throw new Error(`Cannot find ${attributeName}`);
  }
};

const getUserAccountId = async (email) => {
  if (!email) {
    throw new Error('User email cannot be empty');
  }
  const response = await chime.listAccounts({UserEmail: email}).promise();
  if (!response || !response.Accounts || response.Accounts.length < 1) {
    throw new Error(`Cannnot find account for email ${email}`);
  }
  return response.Accounts[0].AccountId;
};

const getUser = async (email) => {
  const accountId = await getUserAccountId(email);
  if (!accountId) {
    throw new Error('User account id cannot be empty');
  }
  const params = {
    AccountId: accountId, /* required */
    UserEmail: email /* required */
  };
  const response = await chime.listUsers(params).promise();
  if (!response || !response.Users || response.Users.length < 1) {
    throw new Error(`Cannnot find user for email ${email}, accountId = ${accountId}`);
  }
  return response.Users[0];
}

const notifyRoom = (webhook, messageBody) => {
  return requestPromise({
    method: 'POST',
    uri: webhook,
    body: {
        Content: messageBody
    },
    json: true
  });
};

exports.handler = handleInboundCall;
