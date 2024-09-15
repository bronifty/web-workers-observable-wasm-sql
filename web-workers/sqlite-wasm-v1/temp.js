(function () {
  console.log("temp.js");
  document.querySelector("#output").textContent = "temp.js";
  let logHtml;
  logHtml = function (...args) {
    console.log(...args);
    const ln = document.createElement("div");
    ln.append(document.createTextNode(args.join(" ")));
    document.body.append(ln);
  };
  const log = (...args) => logHtml("", ...args);
  const warn = (...args) => logHtml("warning", ...args);
  const error = (...args) => logHtml("error", ...args);

  const demo = function (sqlite3) {
    const oo = sqlite3.oo1;
    const db = new oo.DB("/mydb.sqlite3", "ct");
    log("transient db =", db.filename);
    try {
      db.exec({
        sql: "CREATE TABLE IF NOT EXISTS t(a,b)",
        // ... numerous other options ...
      });
      let i;
      for (i = 20; i <= 25; ++i) {
        db.exec({
          sql: "insert into t(a,b) values (?,?)",
          // bind by parameter index...
          bind: [i, i * 2],
        });
      }
      log("t(a,b)");
      db.exec({
        sql: "select a from t order by a limit 3",
        rowMode: "object", // 'array' (default), 'object', or 'stmt'

        callback: function (row) {
          log(++this.counter, JSON.stringify(row));
        }.bind({ counter: 0 }),
      });
      //   db.exec({
      //     sql: "select 1",
      //     rowMode: "object",
      //     callback: function (row) {
      //       log("row ", ++this.counter, "=", JSON.stringify(row));
      //     }.bind({ counter: 0 }),
      //   });
    } catch (e) {
      error("Exception:", e.message);
    }
  };
  globalThis
    .sqlite3InitModule({
      /* We can redirect any stdout/stderr from the module like so, but
       note that doing so makes use of Emscripten-isms, not
       well-defined sqlite APIs. */
      print: log,
      printErr: error,
    })
    .then(function (sqlite3) {
      //console.log('sqlite3 =',sqlite3);
      log("Done initializing. Running demo...");
      try {
        demo(sqlite3);
      } catch (e) {
        error("Exception:", e.message);
      }
    });
})();
