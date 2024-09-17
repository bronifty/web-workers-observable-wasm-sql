// import { default as promiserFactory } from "./jswasm/sqlite3-worker1-promiser.mjs";

// const promiser = promiserFactory();

// promiser.exec("select 1").then((result) => {
//   console.log(result);
// });

import promiserFactory from "./jswasm/sqlite3-worker1-promiser.mjs";

(async function () {
  const promiserConfig = {
    // Optional: Define debug, error handlers, etc.
    debug: undefined,
    onunhandled: (ev) => {
      console.error("Unhandled worker message:", ev.data);
    },
    onerror: (ev) => {
      console.error("Worker error:", ev);
    },
  };

  try {
    // Initialize the worker and get the promiser function
    const workerPromise = await promiserFactory().then((func) => {
      console.log("Worker initialized successfully.");
      return func;
    });

    // Step 1: Open the database
    const openResponse = await workerPromise({
      type: "open",
      args: {
        // Include any necessary parameters for opening the DB
        // e.g., filename, in-memory, etc.
        dbName: "test.db",
      },
    });

    console.log("Database opened:", openResponse);

    // Step 2: Execute the "select 1" query
    const execResponse = await workerPromise({
      type: "exec",
      args: {
        sql: "select 1",
        resultRows: [], // Specify expected structure if needed
        columnNames: [], // Specify expected structure if needed
      },
    });

    // Log the worker's response
    console.log("Worker response:", execResponse);

    // Optionally, display the result in the HTML
    const output = document.getElementById("output");
    if (output) {
      output.textContent = `Worker response: ${JSON.stringify(execResponse)}`;
    }
  } catch (error) {
    console.error("Error communicating with worker:", error);
  }
})();
