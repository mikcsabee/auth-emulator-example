import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require("../serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const helloWorld = functions.https.onRequest(async (request, response) => {
  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new Error("Missing Bearer token!");
  }

  try {
    const decodedToken = await app.auth().verifyIdToken(token, true);
    response.send(decodedToken);
  } catch (e) {
    throw new Error("Invalid Bearer token!");
  }
});

export {helloWorld};
