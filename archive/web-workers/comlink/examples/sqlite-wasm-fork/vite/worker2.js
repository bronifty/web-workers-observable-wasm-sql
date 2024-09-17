import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let db;

const log = (...args) => postMessage({ type: 'log', payload: args.join(' ') });
const error = (...args) =>
  postMessage({ type: 'error', payload: args.join(' ') });

sqlite3InitModule({
  print: log,
  printErr: error,
})
  .then((sqlite3) => {
    log('SQLite initialized');
    if ('opfs' in sqlite3) {
      db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
      log('OPFS is available, created persisted database at', db.filename);
    } else {
      db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
      log('OPFS is not available, created transient database', db.filename);
    }

    // Initialize the todos table
    db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    )
  `);
    log('Todos table created or already exists');

    // Check if table is empty and insert initial data if needed
    const count = db.selectValue('SELECT COUNT(*) FROM todos');
    log('Current number of todos:', count);
    if (count === 0) {
      db.exec(`
      INSERT INTO todos (task) VALUES 
      ('Learn SQLite WASM'),
      ('Build a todo app'),
      ('Enjoy coding!')
    `);
      log('Inserted initial todos');
    }

    // Log the current contents of the todos table
    const todos = db.exec('SELECT * FROM todos');
    log('Current todos:', JSON.stringify(todos));

    postMessage({ type: 'ready' });
  })
  .catch((err) => error('SQLite initialization failed:', err.message));

// ... (previous code remains the same)

// Handle messages from the main thread
self.onmessage = (e) => {
  if (!db) {
    error('Database not initialized');
    return;
  }

  const { query, params } = e.data;
  log('Received query:', query, 'with params:', JSON.stringify(params));

  try {
    let results;
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      results = db.exec({
        sql: query,
        bind: params,
        rowMode: 'object', // Return results as objects
      });
      log('SELECT query results:', JSON.stringify(results));
      // Send the actual results, not just the values
      postMessage({ type: 'queryResult', payload: results });
    } else {
      // For non-SELECT queries, execute and return affected rows
      db.exec({
        sql: query,
        bind: params,
      });
      const affectedRows = db.changes();
      log('Non-SELECT query affected rows:', affectedRows);
      postMessage({ type: 'queryResult', payload: { affectedRows } });
    }
  } catch (err) {
    error('Query execution failed:', err.message);
    console.error('Full error:', err); // Log full error to console for debugging
  }
};
