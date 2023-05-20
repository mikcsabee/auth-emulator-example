import newman, {type NewmanRunSummary} from "newman";
import {type Collection, VariableDefinition} from "postman-collection";

/**
 * Executes a Newman test asynchronously
 * @param { Collection } collection Postman Collection
 * @return { NewmanRunSummary } Promise of summary
 */
async function newmanRunner(collection: Collection): Promise<NewmanRunSummary> {
  return new Promise((resolve, reject) => {
    newman.run(
      {
        collection,
        reporters: "cli",
      },
      (err, summary) => {
        if (err) {
          throw reject(err);
        }
        resolve(summary);
      }
    );
  });
}

/**
 * Fins a Postman variable based on key
 * @param { VariableDefinition[] } variables array of variables
 * @param { string } key variable key
 * @return { string } variable value
 */
function getCollectionVariable(
  variables: VariableDefinition[], key: string): string {
  return variables.filter((item) => item.key === key)[0].value;
}

test("Test postman collection", async () => {
  const collection = require("../../PostmanCollection.json");

  const summary = await newmanRunner(collection);

  const response = JSON.parse(
    summary.run.executions[0].response.stream?.toString() ?? ""
  );

  const email = getCollectionVariable(collection.variable, "authEmail");
  const name = getCollectionVariable(collection.variable, "authName");

  expect(response).toMatchObject({
    name,
    picture: "",
    email,
    email_verified: true,
    firebase: {
      identities: {
        email: [email],
      },
      sign_in_provider: "google.com",
    },
    aud: "auth-emulator-example",
    iss: "https://securetoken.google.com/auth-emulator-example",
  });
});

