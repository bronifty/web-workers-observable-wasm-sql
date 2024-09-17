let logHtml;
logHtml = function (...args) {
  console.log(...args);
  const ln = document.createElement("div");
  ln.append(document.createTextNode(args.join(" ")));
  document.body.append(ln);
};
const log = (...args) => logHtml("", ...args);
window
  .sqlite3InitModule({
    print: log,
    printErr: log,
  })
  .then(function (sqlite3) {
    // The module is now loaded and the sqlite3 namespace
    // object was passed to this function.
    console.log("sqlite3:", sqlite3);
    const db = new sqlite3.oo1.DB();
    try {
      db.exec([
        "create table t(a);",
        "insert into t(a) ",
        "values(10),(20),(30)",
      ]);
      log("t(a)");
      db.exec({
        sql: "select a from t order by a limit 3",
        rowMode: "object", // 'array' (default), 'object', or 'stmt'

        callback: function (row) {
          log(++this.counter, JSON.stringify(row));
        }.bind({ counter: 0 }),
      });
    } finally {
      db.close();
    }
  });
// import { default as sqlite3InitModule } from "./jswasm/sqlite3.mjs";
// globalThis.sqlite3ApiConfig = {
//   // define any or all of these:
//   warn: () => {},
//   error: () => {},
//   debug: () => {},
//   log: (...args) => {
//     console.log(...args);
//   },
// };

// sqlite3InitModule().then((sqlite3) => {
//   sqlite3.log("Loaded sqlite3", sqlite3.version);
// });

// globalThis.sqlite3InitModule(sqlite3ApiConfig).then(function (sqlite3) {
//   //console.log('sqlite3 =',sqlite3);
//   log("Done initializing. Running demo...");
//   try {
//     demo(sqlite3);
//   } catch (e) {
//     error("Exception:", e.message);
//   }
// });
