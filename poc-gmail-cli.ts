#!/usr/bin/env node_modules/.bin/tsx

// #!/usr/bin/env npx --package=ts-node -- ts-node-esm --swc
// #!/usr/bin/env zx

// TODO: remove the 'as any' used to make the auth type from @google-cloud/local-auth compatible with @googleapis/gmail

// TODO: restructure the code to be a CLI tool runnable using oclif?
//   https://oclif.io/
//   https://github.com/oclif/oclif
//   some commands to include: login, logout, whoami version, help
//
// TODO: cache the fetched credentials somewhere secure locally
//
// TODO: handle automatically updating saved credentials when the lib automatically refreshes tokens?

// ref:
//   https://github.com/google/zx
//   https://www.npmjs.com/package/@googleapis/gmail
//   https://github.com/googleapis/nodejs-local-auth
//   https://github.com/googleapis/google-auth-library-nodejs
//   https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/oauth2-codeVerifier.js
//   https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/oauth2.js
//   https://github.com/googleapis/google-api-nodejs-client/tree/main/samples/gmail
//   https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/gmail/list.js

// import 'zx/globals'

import * as fs from 'fs'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// import open from "open"

import { OAuth2Client } from 'google-auth-library';
import { authenticate } from '@google-cloud/local-auth'
// import gmail from '@googleapis/gmail'
import { gmail } from '@googleapis/gmail'

const authKeyFilePath: string | undefined = process.env['AUTH_KEY_FILE']

if (authKeyFilePath === undefined) {
  console.error("'AUTH_KEY_FILE' env variable is required")
  process.exit(1)
}

// // ref:
// //   https://github.com/googleapis/google-api-nodejs-client#oauth2-client
// //   https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/oauth2.js
// // const auth = new gmail.auth.GoogleAuth({
// //   projectId: '',
// //   scopes: '',
// //   clientOptions: {
// //     clientId: '',
// //     clientSecret: '',
// //     redirectUri: '',
// //     // refreshToken: '',
// //   }
// // })

// // new gmail.AuthPlus({
// //   clientId: process.env.OAUTH2_CLIENT_ID,
// //   clientSecret: process.env.OAUTH2_CLIENT_SECRET,
// //   redirectUri: process.env.OAUTH2_REDIRECT_URL,
// // })

// const oauth2Client = new gmail.auth.OAuth2({
//   clientId: process.env.OAUTH2_CLIENT_ID,
//   clientSecret: process.env.OAUTH2_CLIENT_SECRET,
//   redirectUri: process.env.OAUTH2_REDIRECT_URL,
// })

// Set the path to the file where the auth tokens will be saved
const tokensFilePath = './auth-tokens.json'

// ref: https://developers.google.com/gmail/api/auth/scopes?authuser=1
const scopes = [
  // 'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.readonly',
]

// // OAuth2 Redirect Flow
// // const authorizeUrl = oauth2Client.generateAuthUrl({
// //   access_type: 'offline',
// //   scope: scopes.join(' '),
// // });

// // OAuth2 Code Challenge Flow
// const codes = await oauth2Client.generateCodeVerifierAsync();
// const authorizeUrl = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: scopes.join(' '),
//   // When using `generateCodeVerifier`, make sure to use code_challenge_method 'S256'.
//   code_challenge_method: 'S256',
//   // Pass along the generated code challenge.
//   code_challenge: codes.codeChallenge,
// });

// ref: https://github.com/googleapis/nodejs-local-auth
// Check if the tokens file exists
let authClient: OAuth2Client | null = null
if (fs.existsSync(tokensFilePath)) {
  // Load the auth tokens from the file
  const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'))
  console.log('Tokens (loaded from disk):', tokens)

  authClient = new OAuth2Client();
  authClient.setCredentials(tokens)
} else {
  // const localAuth = await authenticate({
  authClient = await authenticate({
    scopes,
    keyfilePath: authKeyFilePath,
  }) as unknown as OAuth2Client  // TODO: remove the as any here and fix the types properly
  // authTokens = localAuth.credentials

  console.log('Tokens (fetched from auth flow):', authClient.credentials)

  // Save the auth tokens to the file
  fs.writeFileSync(tokensFilePath, JSON.stringify(authClient.credentials))
}

// console.log('Auth URL:', authorizeUrl);

// await open(authorizeUrl, { wait: false });

// // TODO: run a local webserver to receive the redirect URL with the code in it as per: https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/oauth2-codeVerifier.js

// // TODO: only ask manually if we can't run the webserver or similar
// const code = await question('What was the challenge response code returned by Google? ');

// const authToken = await oauth2Client.getToken({
//   code,
//   codeVerifier: codes.codeVerifier,
// });

// oauth2Client.setCredentials(authToken);

// console.info('Tokens acquired.');
// console.log('Token Type:', authToken.tokens.token_type);

// const messagesResponse = await gmail('v1').users.messages.list({
const gmailClient = gmail({
  version: 'v1',
  auth: authClient,
  http2: true,
})

// // ref: https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list?authuser=1
// const { data: messageListData } = await gmailClient.users.messages.list({
//   userId: 'me',
//   labelIds: [
//     'INBOX',
//     // 'CATEGORY_PROMOTIONS',
//     // 'UNREAD',
//   ],
//   // q: '',
//   maxResults: 5,
//   // pageToken: '',
// })
// console.log(messageListData)
// console.log(messageListData.messages?.[0])

const query = 'in:inbox category:promotions';
const res = await gmailClient.users.messages.list({
  userId: 'me',
  q: query,
  maxResults: 1,
});
console.log('Result:', res.data)

console.log("TODO: explore whether this .reduce() code would be an efficient way to fetch all of the paginated results")
// TODO: explore whether this .reduce() code would be an efficient way to fetch all of the paginated results:
// const query = 'in:inbox category:promotions ';
//
// let nextPageToken = '';
//
// // Use .reduce to query all of the results
// const messages = [].reduce(async (promise, result) => {
//   // Wait for the previous iteration to complete
//   await promise;
//
//   // Use the 'gmailClient.users.messages.list' method to get a list of messages
//   const res = await gmailClient.users.messages.list({
//     userId: 'me',
//     q: query,
//     pageToken: nextPageToken,
//   });
//
//   // Add the messages from the response to the result array
//   result.push(...res.data.messages);
//
//   // Check if there are more pages of results
//   if (res.data.nextPageToken === undefined) {
//     // There are no more pages of results, so we can return the result array
//     return result;
//   } else {
//     // Set the nextPageToken to the value from the response
//     nextPageToken = res.data.nextPageToken;
//   }
// }, Promise.resolve());
//
// // Use the messages
// // ...

console.log("TODO: explore whether this recursive function call is an efficient way to fetch all of the paginated results")
// TODO: explore whether this recursive function call is an efficient way to fetch all of the paginated results:
// const query = 'in:inbox category:promotions ';
//
// let nextPageToken = '';
//
// // Define a recursive function to query all of the results
// const getMessages = async (results = []) => {
//   // Use the 'gmailClient.users.messages.list' method to get a list of messages
//   const res = await gmailClient.users.messages.list({
//     userId: 'me',
//     q: query,
//     pageToken: nextPageToken,
//   });
//
//   // Add the messages from the response to the results array
//   results.push(...res.data.messages);
//
//   // Check if there are more pages of results
//   if (res.data.nextPageToken === undefined) {
//     // There are no more pages of results, so we can return the results array
//     return results;
//   } else {
//     // Set the nextPageToken to the value from the response
//     nextPageToken = res.data.nextPageToken;
//
//     // Call the function again to get the next page of results
//     return getMessages(results);
//   }
// }
//
// // Use the getMessages function to get the list of messages
// const messages = await getMessages();
//
// // Use the messages
// // ...


// TODO: loop over all of the messages
// TODO: batch request rather than getting each message individually: https://developers.google.com/gmail/api/guides/batch?authuser=1
//   You're limited to 100 calls in a single batch request. If you need to make more calls than that, use multiple batch requests.
//   Note: Larger batch sizes are likely to trigger rate limiting. Sending batches larger than 50 requests is not recommended.
//   https://github.com/google/google-api-javascript-client/blob/master/docs/batch.md
//   https://github.com/googleapis/google-api-nodejs-client/issues/2375
//     Batch Request Documentation
//     Part of this thread seems to suggest that http2 may be a sort of solution to batching.. others disagree.. could be worth using anyway
//   https://github.com/googleapis/google-api-nodejs-client#http2
// TODO: can we use a flatMap or similar here to improve the typing?
// const messageDetailsList = messageListData.messages?.map(async (message) => {
//   // const messageId: string | undefined = messageListData?.messages?.[0]?.id ?? undefined;
//   const messageId: string | undefined = message.id ?? undefined
//
//   // TODO: handle this error more gracefully (it probably shouldn't really happen in reality, but the types suggest that it can..)
//   if (messageId === undefined) {
//     console.error("'messageId' is undefined")
//     // process.exit(1)
//     // return [] // for use with flatMap
//     return undefined
//   }
//
//   // ref:
//   //   https://developers.google.com/gmail/api/reference/rest/v1/users.messages/get?authuser=1
//   //   https://developers.google.com/gmail/api/reference/rest/v1/Format?authuser=1
//
//   //   https://developers.google.com/gmail/api/reference/rest/v1/users.messages?authuser=1#Message
//   //   https://developers.google.com/gmail/api/reference/rest/v1/users.messages?authuser=1#Message.MessagePart
//   const messageDataResult = await gmailClient.users.messages.get({
//     userId: 'me',
//     id: messageId,
//     format: 'metadata',
//     // format: 'full',
//     // metadataHeaders: [], // TODO: figure out the minimal set of headers we want here
//   })
//
//   console.log(messageDataResult.data)
//   console.log(messageDataResult.data.payload?.headers)
//
//   // return [messageDataResult.data] // for use with flatMap
//   return messageDataResult.data
// })

// TODO: figure out which of these headers we actually care about and pass them into 'metadataHeaders' in the call above.
//   There might be others that we want too.. so probably worth collecting example headers from a larger set of messages.
//
//   Delivered-To
//   Return-Path
//   To
//   List-Unsubscribe
//   Subject
//   Sender
//   Date
//   From
//   Reply-To
