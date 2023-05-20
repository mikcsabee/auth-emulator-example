const fs = require("fs");
const {exec} = require("child_process");
const template = require("./PostmanCollection.template.json");
const {generateKeyPairSync} = require("crypto");

const compiledPreRequestScript = "dist/pre-request_script.js";
const collectionOutput = "../PostmanCollection.json";
const serviceKeyOutput = "../functions/serviceAccountKey.json";

/**
 * compiles the postman_pre-request_script.ts using exec
 * @return {Promise<void>}
 */
async function compile(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec("npx tsc --project tsconfig.postman.json",
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        }

        if (stdout) {
          console.log(`stdout: ${stdout}`);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }

        resolve();
      });
  });
}

/**
 * reads the compiled postman_pre-request_script.js and returs it line-by-line
 * as a string array
 * @return { string[] }
 */
function getPreScriptByLine(): string[] {
  const content = fs
    .readFileSync(compiledPreRequestScript)
    .toString()
    .split("\n");
  content.shift();
  return content;
}

/**
 * Overwrites the original postman_pre-request_script.js
 * @param { string[] } content the content line-by-line
 */
function overwritePreScript(content: string[]): void {
  fs.writeFileSync(compiledPreRequestScript, content.join("\n"));
}

/**
 * Creates a Postman collection using a template and the content
 * @param { string[] } content the content line-by-line
 */
function createCollection(content: string[]): void {
  template.event[0].script.exec = content;
  fs.writeFileSync(collectionOutput, JSON.stringify(template, null, 2));
}

/**
 * This method generates a fake serviceAccountKey to the functions folder
 */
async function generateFakeServiceAccount() {
  const privateKey: string = generateKeyPairSync("rsa", {
    modulusLength: 512,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "top secret",
    },
  }).privateKey;

  const serviceAccount = {
    "project_id": "auth-emulator-example",
    "client_email": "test@test.com",
    "private_key": privateKey,
  };
  fs.writeFileSync(serviceKeyOutput, JSON.stringify(serviceAccount, null, 2));
}

/**
 * Main entry point
 */
async function main() {
  await compile();
  const content = getPreScriptByLine();
  overwritePreScript(content);
  createCollection(content);
  await generateFakeServiceAccount();
}

main().then(() => console.log("Build successful!"));
