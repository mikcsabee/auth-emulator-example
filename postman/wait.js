const http = require("http");

/**
 * This method tries to fetch the Firebase Emulator configuration
 * @return {object} Firebase Emulator configuration
 */
async function getConfig() {
  return new Promise((resolve, reject) => {
    http
      .get("http://localhost:4000/api/config", (res) => {
        const data = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          resolve(JSON.parse(Buffer.concat(data).toString()));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

/**
 * This method wraps the setTimeout method in a Promise
 * @param {number} timeout in miliseconds
 * @return {Promise}
 */
async function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * Main entry point
 */
async function main() {
  let result;
  for (let i = 0; i < 30; i++) {
    try {
      result = await getConfig();
      if (result.projectId === "auth-emulator-example") {
        console.log("Firebase Emulator is running");
        process.exit(0);
      } else {
        await sleep(1 * 1000);
      }
    } catch (e) {
      console.log(`Waiting... (${i + 1})`);
      await sleep(1 * 1000);
    }
  }
  process.exit(1);
}

main()
  .then(() => console.log("Done"))
  .catch((error) => console.error(error));
