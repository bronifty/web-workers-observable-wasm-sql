import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
// import * as Comlink from "comlink";
async function init() {
  const worker = new Worker("/src/worker.js");
  // WebWorkers use `postMessage` and therefore work with Comlink.
  const obj = Comlink.wrap(worker);
  alert(`Counter: ${await obj.counter}`);
  await obj.inc();
  alert(`Counter: ${await obj.counter}`);
}
init();
