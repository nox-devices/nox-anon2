import {
  Client,
  setupAnonBrowserWithContext,
  executeRuntimeScript,
  Environment,
} from "@anon/sdk-typescript";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import {
  APP_CONFIG,
  AppName,
  DEFAULT_APP,
  DO_DELETE_SESSION,
} from "./actions/config";
import readline from "readline";

console.log("Starting script execution...");

// Load environment variables from parent .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log("Environment variables loaded.");

// Configuration
const APP_USER_ID = process.env.ANON_APP_USER_ID!;
const API_KEY = process.env.ANON_API_KEY!;
const ANON_ENV = process.env.ANON_ENV! as Environment;
const APP: AppName = (process.env.APP as AppName) || DEFAULT_APP;

console.log("Configuration set:");
console.log(`APP_USER_ID: ${APP_USER_ID ? "Set" : "Not set"}`);
console.log(`API_KEY: ${API_KEY ? "Set" : "Not set"}`);
console.log(`ANON_ENV: ${ANON_ENV}`);
console.log(`APP: ${APP}`);

// Validate environment variables
[
  { name: "ANON_APP_USER_ID", value: APP_USER_ID },
  { name: "ANON_API_KEY", value: API_KEY },
  { name: "ANON_ENV", value: ANON_ENV },
].forEach(({ name, value }) => {
  if (!value) {
    console.error(`Error: Please set the ${name} environment variable.`);
    process.exit(1);
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const account = {
  app: APP,
  userId: APP_USER_ID,
};

console.log("Creating Anon client...");
const client = new Client({
  environment: ANON_ENV,
  apiKey: API_KEY,
});
console.log("Anon client created.");

const appList = Object.keys(APP_CONFIG).map((app, index) => {
  return `${index + 1}: ${app} - ${Object.keys(APP_CONFIG[app].actions).join(', ')}`;
}).join('\n');

rl.question(`Enter the number of the app you want to run:\n${appList}\n`, (appInput) => {
  const appIndex = parseInt(appInput) - 1;
  const selectedApp: AppName = Object.keys(APP_CONFIG)[appIndex] as AppName;

  const actionList = Object.keys(APP_CONFIG[selectedApp].actions).map((action, index) => {
    return `${index + 1}: ${action}`;
  }).join('\n');

  rl.question(`Enter the number of the action you want to run for ${selectedApp}:\n${actionList}\n`, (actionInput) => {
    const actionIndex = parseInt(actionInput) - 1;
    const ACTION = Object.keys(APP_CONFIG[selectedApp].actions)[actionIndex];

    rl.question('Enter the parameters (as a JSON string): ', (paramsInput) => {
      let params;
      if (paramsInput.trim() === '') {
        params = {};
      } else {
        params = JSON.parse(paramsInput);
      }
      APP_CONFIG[selectedApp].params = params;

      const main = async () => {
        console.log(
          `Requesting ${account.app} session for app user id "${APP_USER_ID}"...`
        );
        try {
          console.log("Setting up Anon browser with context...");
          const { browser } = await setupAnonBrowserWithContext(client, account, {
            type: "managed",
            input: {},
          });
          // const { browserContext } = await setupAnonBrowserWithContext(
          //   client,
          //   account,
          //   { type: "local", input: { headless: false } },
          // );
      
          console.log("Anon browser setup complete.");
      
          console.log("Getting first page from browser context...");
          const page = browser.contexts()[0].pages()[0];
          console.log("Page acquired.");
      
          console.log("Executing runtime script...");
          await executeRuntimeScript({
            client,
            account,
            target: { page: page },
            initialUrl: APP_CONFIG[selectedApp].url,
            cleanupOptions: { closePage: true, closeBrowserContext: true },
            run: async (page) => await APP_CONFIG[selectedApp].actions[ACTION](page, APP_CONFIG[selectedApp].params),
          });
          console.log("Runtime script execution completed.");
      
          const accountInfo = { ownerId: APP_USER_ID, domain: account.app };
      
          // Demo `getSessionStatus`
          let sessionStatus = await client.getSessionStatus({ account: accountInfo });
          console.log(`Client session status: ${JSON.stringify(sessionStatus)}`);
      
          if (DO_DELETE_SESSION) {
            const demoDeleteSession = async () => {
              // Demo `deleteSession`
              await client.deleteSession({ account: accountInfo });
              console.log(`Session deleted for ${JSON.stringify(accountInfo)}`);
      
              sessionStatus = await client.getSessionSessionStatus({ account: accountInfo });
              console.log(
                `After deleting session, client session status: ${JSON.stringify(
                  sessionStatus
                )}`
              );
            };
      
            await demoDeleteSession();
          }
          console.log("Script execution finished successfully.");
        } catch (error) {
          console.error("Error in main function:", error);
        }
      };
      
      console.log("Starting main function...");
      main()
        .then(() => console.log("Script execution completed."))
        .catch((error) => console.error("Unhandled error in main:", error));
        
      rl.close();
    });
  });
});
