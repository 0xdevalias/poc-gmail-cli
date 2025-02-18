// Ref: ChatGPT: https://chat.openai.com/chat/9c8eb340-c6d8-491a-85a4-9af9c1708166
//   Prompt:
//     Write me some JavaScript code that will use the gmail API to retrieve all emails that are in my inbox, in the promotions tab; and extract the headers from them, saving them to a json file.
//     I also want to see a list of email addresses that these emails were sent from, and how many emails were sent from each, sorted from most emails to least emails.
//     It would be really cool if I could also get an estimate/breakdown of how many emails each address sends me on average per day, per week, per month, and per year

// First, you'll need to set up the Gmail API and authenticate with it
// You can find more information on this in the Google API documentation
// Once you've done that, you can use the following code to retrieve the emails:

// Import the necessary libraries
const { google } = require('googleapis');
const fs = require('fs');

// Define the parameters for the API call
const userId = 'me';
const labelIds = ['INBOX', 'CATEGORY_PROMOTIONS'];

const auth = 'TODO';

// Create a new Gmail client
const gmail = google.gmail({ version: 'v1', auth });

// Make the API call to retrieve the emails
gmail.users.messages.list({ userId, labelIds }, (err, res) => {
  if (err) return console.log(`The API returned an error: ${err}`);

  // Get the list of email IDs
  const emailIds = res.data.messages.map((message) => message.id);

  // Create an array to store the headers and sender addresses
  let headers = [];
  let senderAddresses = {};

  // Loop through the email IDs and retrieve the headers for each one
  for (let i = 0; i < emailIds.length; i++) {
    gmail.users.messages.get({ userId, id: emailIds[i] }, (err, res) => {
      if (err) return console.log(`The API returned an error: ${err}`);

      // Extract the headers and sender address
      const emailHeaders = res.data.payload.headers;
      const sender = emailHeaders.find(
        (header) => header.name === 'From'
      ).value;

      // Add the headers and sender address to the appropriate arrays
      headers.push(emailHeaders);
      if (senderAddresses[sender]) {
        senderAddresses[sender]++;
      } else {
        senderAddresses[sender] = 1;
      }
    });
  }

  // Once the loop is finished, save the headers and sender addresses to a JSON file
  fs.writeFileSync('headers.json', JSON.stringify(headers));
  fs.writeFileSync('senderAddresses.json', JSON.stringify(senderAddresses));

  // Sort the sender addresses by the number of emails they sent
  const sortedSenders = Object.keys(senderAddresses).sort(
    (a, b) => senderAddresses[b] - senderAddresses[a]
  );

  // Print out the list of sender addresses and the number of emails they sent
  for (let i = 0; i < sortedSenders.length; i++) {
    console.log(
      `${sortedSenders[i]}: ${senderAddresses[sortedSenders[i]]} emails`
    );
  }

  // for getting the average of emails sent per day,week,month,year you can use some date-time libraries like moment.js
  //and then use the email timestamp to calculate the average by dividing
});
