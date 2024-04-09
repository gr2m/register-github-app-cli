#!/usr/bin/env node

import crypto from "node:crypto";
import { extname } from "node:path";
import { readFile } from "node:fs/promises";

import meow from "meow";
import registerGitHubApp from "register-github-app";
import yaml from "js-yaml";

const cli = meow(
  `
  Usage
    $ register-github-app-cli

  Options
    --manifest Path to YAML or JSON manifest file
    --org Set organization login

  Examples
    $ register-github-app-cli
    # register app with no events or permissions on user account
    $ register-github-app-cli --org my-org --manifest app.yml
    # registers app on github.com/my-org using settings from app.yml
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    flags: {
      manifest: {
        type: "string",
      },
      org: {
        type: "string",
      },
    },
  },
);

const org = cli.flags.org;
let manifest;

if (cli.flags.manifest) {
  try {
    const manifestContent = await readFile(cli.flags.manifest);
    switch (extname(cli.flags.manifest)) {
      case ".yml":
      case ".yaml":
        manifest = yaml.load(manifestContent);
        break;
      case ".json":
        manifest = JSON.parse(manifestContent);
        break;
      default:
        console.log(`Unsupported file extension: ${cli.flags.manifest}`);
        process.exit(1);
    }
  } catch (error) {
    console.log(`Could not read manifest from ${cli.flags.manifest}`);
    process.exit(1);
  }
}

const appCredentials = await registerGitHubApp({ org, ...manifest });
const privateKeyPKCS8 = String(
  crypto.createPrivateKey(appCredentials.pem).export({
    type: "pkcs8",
    format: "pem",
  }),
);
const singleLinePrivateKey = privateKeyPKCS8.trim().replace(/\n/g, "\\n");

console.log(`Add these lines to your .env file:

GITHUB_APP_ID=${appCredentials.id}
GITHUB_APP_PRIVATE_KEY="${singleLinePrivateKey}"
GITHUB_APP_WEBHOOK_SECRET=${appCredentials.webhook_secret}
GITHUB_APP_CLIENT_ID=${appCredentials.client_id}
GITHUB_APP_SECRET=${appCredentials.client_secret}`);
