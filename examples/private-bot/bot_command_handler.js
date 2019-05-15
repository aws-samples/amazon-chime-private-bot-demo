// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const requestPromise = require('request-promise');

const COMMAND_MESSAGE_REG_EXP = /^@\S+?\s+(\S+)\s*(.*)/i;

const HELP_MESSAGE = `Private bot available commands:
  - check-inventory: example @<bot_name> check-inventory product:Funtainer brand:Thermos
  - find-in-store: @<bot_name> find-in-store sku:therfun034dl`

const PRODUCT_CATALOGUE_ATTRIBUTES = [
  'product', 'brand', 'name', 'price', 'color', 'sku', 'availability', 'link'
];

const PRODUCT_CATALOGUE = [
  {
    product: 'Funtainer',
    brand: 'Thermos',
    name: 'Thermos Funtainer 10 ounce',
    price: '$10.99',
    color: 'Yellow',
    sku: 'therfun034ds',
    availability: 'In-stock',
    link: '[https://example.com/products/thermos-funtainer-10oz](https://www.amazon.com/Thermos-Funtainer-Ounce-Food-Blue/dp/B00CBFAE6W/ref=sr_1_3?keywords=Thermos+Funtainer+10+ounce&qid=1557203036&s=gateway&sr=8-3)'
  },
  {
    product: 'Funtainer',
    brand: 'Thermos',
    name: 'Thermos Funtainer 18 ounce',
    price: '$19.99',
    color: 'Purple',
    sku: 'therfun034dl',
    availability: 'Out-of-stock',
    link: '[https://example.com/products/thermos-funtainer-18oz](https://www.amazon.com/dp/B002PY7AYS/ref=sspa_dk_detail_0?psc=1&pd_rd_i=B002PY7AYS&pd_rd_w=oRGGo&pf_rd_p=8a8f3917-7900-4ce8-ad90-adf0d53c0985&pd_rd_wg=aKexj&pf_rd_r=BH2S0AP2S6KF4JY3KKQ7&pd_rd_r=691dbf90-7081-11e9-bb1d-335c9152e117)'
  }
];

const INVENTORYS_ATTRIBUTES = [
  'sku', 'store', 'address', 'hours', 'phone', 'zipcode'
]

const INVENTORYS = [
  {
    sku: 'therfun034dl',
    store: 'Outdoor Store',
    address: '2111 7th Ave, Seattle, WA 98121',
    hours: '10:00AM-9:00PM',
    phone: '+1(206)555-1234',
    zipcode: '98121'
  },
  {
    sku: 'therfun034dl',
    store: 'Outdoor Store',
    address: '399 4th St, Edmunds, WA 98020',
    hours: '11:00AM-10:00PM',
    phone: '+1(425)618-0066',
    zipcode: '98020'
  }
]

const handle = async (event) => {
  const incomingWebhook = event.InboundHttpsEndpoint.Url;
  const message = replyMessage(event.Message);
  return await notifyRoom(incomingWebhook, message);
}

const replyMessage = (event) => {
  const commandParts = COMMAND_MESSAGE_REG_EXP.exec(event);
  if (!commandParts) {
    return HELP_MESSAGE;
  }
  const commandName = commandParts[1];
  const commandPayload = commandParts[2];
  return processCommand(commandName, commandPayload);
}

const checkInventory = (options) => {
  if (options == 'help') {
    return `Example: @<bot_name> check-inventory product:Funtainer brand:Thermos\nSupported attributes: ${JSON.stringify(PRODUCT_CATALOGUE_ATTRIBUTES)}`;
  }
  const result = query(options, PRODUCT_CATALOGUE, PRODUCT_CATALOGUE_ATTRIBUTES);
  return result.length > 0 ? `/md\n## I recommend these products based on criteria: ${options}\n${prettify(result, PRODUCT_CATALOGUE_ATTRIBUTES)}` : `Requested product cannot be found in cataloge`;
}

const findInStore = (options) => {
  if (options == 'help') {
    return `Example: @<bot_name> find-in-store sku:therfun034dl\nSupported attributes: ${JSON.stringify(PRODUCT_CATALOGUE_ATTRIBUTES)}`;
  }
  const result = query(options, INVENTORYS, INVENTORYS_ATTRIBUTES);
  return result.length > 0 ? `/md\n## I found inventory in these stores based on criteria: ${options}\n${prettify(result, INVENTORYS_ATTRIBUTES)}`  : `Requested product cannot be found in any stores`;
}

const prettify = (items, attributes) => {
  let output = attributes.join('|') + '\n';
  output += Array(attributes.length).fill('---').join('|') + '\n';
  for (item of items) {
    const row = [];
    for (attribute of attributes) {
      row.push(item[attribute]);
    }
    output += row.join('|') + '\n';
  }
  return output;
}

const processCommand = (commandName, inputJson) => {
  switch (commandName) {
    case 'check-inventory':
      return checkInventory(inputJson);
    case 'find-in-store':
      return findInStore(inputJson);
    default:
      return `Command ${commandName}, not exist.\n` + HELP_MESSAGE;
  }
}

const getAttributeFromQueryExpression = (queryExpression, attribute) => {
  const regExp = new RegExp(`.*${attribute}:\\s*(\\S+)`, 'i');
  const parts = regExp.exec(queryExpression);
  return parts ? parts[1] : null;
}

const query = (queryExpression, table, attributes) => {
  return table.filter((item) => {
    let match = 0;
    for (attribute of attributes) {
      const queryValue = getAttributeFromQueryExpression(queryExpression, attribute);
      if (queryValue && (queryValue != item[attribute])) {
        return false;
      }
      match += queryValue ? 1: 0;
    }
    return match != 0;
  });
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

module.exports = {
  handle: handle,
  notifyRoom: notifyRoom
};
