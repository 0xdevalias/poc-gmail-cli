import fs from 'fs'
import path from 'path'

import prompts from 'prompts'
import { OAuth2Client } from 'google-auth-library'
import { config as dotenvConfig } from 'dotenv'

// TODO: implement the local webbrowser flow as per: https://github.com/googleapis/nodejs-local-auth/blob/main/src/index.ts
//   Also used in legacy-v0/poc-gmail-cli.ts:99

// TODO: Move this to one of the main CLI files that loads config
dotenvConfig()

// TODO: Move this to one of the main CLI files that loads config
const credentialsPath: string | undefined = process.env.GOOGLE_CREDENTIALS_PATH

if (!credentialsPath) {
  throw new Error(
    'Path to Google credentials file not set. Please set the GOOGLE_CREDENTIALS_PATH environment variable in .env file.'
  )
}

// TODO: Move this to one of the main CLI files that loads config?
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(__dirname, '../../token.json')
const OOB_URI = 'urn:ietf:wg:oauth:2.0:oob'

// TODO: Move this to one of the main CLI files that loads config
// Read credentials from the JSON file
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
const { client_secret, client_id } = credentials.installed

// TODO: move this into a separate function?
const oAuth2Client = new OAuth2Client(client_id, client_secret, OOB_URI)

// TODO: add an option to this function to control if the credentials are saved (and/or separate it into a different function?)
export async function authenticateWithOOBFlow() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })

  console.log('Authorize this app by visiting this url:', authUrl)

  const { code } = await prompts({
    type: 'text',
    name: 'code',
    message: 'Enter the code from that page here:',
  })

  const { tokens } = await oAuth2Client.getToken(code)
  oAuth2Client.setCredentials(tokens)

  // TODO: separate token saving into a separate function?
  // Store the tokens to disk for later use
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
  console.log('Tokens stored to', TOKEN_PATH)

  return tokens
}

// TODO: should we do anything in this logout function?
export function logout() {
  try {
    fs.unlinkSync(TOKEN_PATH)
    console.log('Logged out successfully.')
  } catch (e) {
    console.error('Error logging out:', e)
  }
}
