import sqlite3Worker1Promiser from "@sqlite.org/sqlite-wasm";

const log = console.log;
const error = console.error;

const initializeSQLite = async () => {
  try {
    log("Loading and initializing SQLite3 module...");

    const promiser = await new Promise((resolve) => {
      const _promiser = sqlite3Worker1Promiser({
        onready: () => resolve(_promiser),
      });
    });

    log("Done initializing. Running demo...");

    const configResponse = await promiser("config-get", {});
    log("Running SQLite3 version", configResponse.result.version.libVersion);

    const openResponse = await promiser("open", {
      filename: "file:mydb.sqlite3?vfs=opfs",
    });
    const { dbId } = openResponse;
    log(
      "OPFS is available, created persisted database at",
      openResponse.result.filename.replace(/^file:(.*?)\?vfs=opfs$/, "$1")
    );
    // Your SQLite code here.
    console.log("attempting to select 1");
    const result = await promiser("exec", {
      sql: "SELECT 1",
      dbId,
    });
    console.log(result);
  } catch (err) {
    if (!(err instanceof Error)) {
      err = new Error(err.result.message);
    }
    error(err.name, err.message);
  }
};

initializeSQLite();
