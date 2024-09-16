// File: demo-worker1-promiser.mjs
import promiserFactory from "./jswasm/sqlite3-worker1-promiser.mjs";

(async function () {
  try {
    // Initialize Promiser v2
    const promiser = await promiserFactory({
      // Optional Configuration
      debug: console.debug,
      onunhandled: (event) => {
        console.error("Unhandled worker message:", event.data);
      },
      onerror: (event) => {
        console.error("Worker error:", event);
      },
    });

    console.log("Promiser initialized successfully.");

    // Proceed to open the database
    const openResult = await promiser("open", { filename: "my-database.db" });
    console.log("Database opened:", openResult);

    // Execute a simple query
    const execResult = await promiser("exec", { sql: "SELECT 1" });
    console.log("Query Result:", execResult);
  } catch (error) {
    console.error("Error communicating with worker:", error);
  }
})();
