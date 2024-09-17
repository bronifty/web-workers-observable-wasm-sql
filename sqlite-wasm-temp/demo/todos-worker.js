// web-workers-observable-wasm-sql/opfs-vite/worker.js

import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

const log = (...args) => postMessage({ type: "log", payload: args.join(" ") });
const error = (...args) =>
  postMessage({ type: "error", payload: args.join(" ") });

let db;

// Initialize the SQLite module and set up the database
sqlite3InitModule({
  print: log,
  printErr: error,
})
  .then((sqlite3) => {
    log("Done initializing SQLite3 module");

    if ("opfs" in sqlite3) {
      db = new sqlite3.oo1.OpfsDb("/todos.sqlite3");
      log("OPFS is available, created persisted database at", db.filename);
    } else {
      db = new sqlite3.oo1.DB("/todos.sqlite3", "ct");
      log("OPFS is not available, created transient database", db.filename);
    }

    // Create todos table if it doesn't exist
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL
        )
      `);
      log("Ensured todos table exists");
    } catch (err) {
      error("Error creating todos table:", err.message);
    }

    // Listen for messages from the main thread
    addEventListener("message", (e) => {
      const { type, payload } = e.data;
      if (type === "add_todo") {
        addTodo(payload.title, payload.description);
      } else if (type === "get_todos") {
        getTodos();
      }
    });
  })
  .catch((err) => {
    error("Failed to initialize SQLite3 module:", err);
  });

// Function to add a new todo
function addTodo(title, description) {
  try {
    const stmt = db.prepare(`
      INSERT INTO todos (title, description)
      VALUES (?, ?)
    `);

    // Bind parameters
    stmt.bind([title, description]);

    // Execute the statement
    while (stmt.step()) {}

    // Finalize the statement
    stmt.finalize();

    log(`Added todo: "${title}"`);

    // Optionally, send updated todos
    getTodos();
  } catch (err) {
    error("Error adding todo:", err.message);
  }
}

// Function to retrieve all todos
function getTodos() {
  try {
    const stmt = db.prepare(`
      SELECT id, title, description FROM todos ORDER BY id ASC
    `);
    const todos = [];

    while (stmt.step()) {
      // Retrieve each column based on its index
      const id = stmt.getInt(0); // id is INTEGER at index 0
      const title = stmt.getString(1); // title is TEXT at index 1
      const description = stmt.getString(2); // description is TEXT at index 2

      // Debugging: Log the retrieved values
      log(
        `Retrieved Todo - ID: ${id}, Title: "${title}", Description: "${description}"`
      );

      // Push the todo object to the todos array
      todos.push({
        id,
        title,
        description,
      });
    }

    stmt.finalize();
    postMessage({ type: "todos", payload: todos });
    log("Retrieved todos successfully.");
  } catch (err) {
    error("Error retrieving todos:", err.message);
  }
}
