const worker = new SharedWorker("/src/worker.mjs", { type: "module" });
const log = console.log;

log("in main.mjs; worker.port.postMessage hello world");
worker.port.postMessage({
  type: "hello",
  payload: "world",
});

worker.port.onmessage = (e) => {
  log("in main.mjs; worker.port.onmessage", JSON.stringify(e.data, null, 2));
  const { type, payload } = e.data;
  if (type === "log") {
    console.log(payload);
  }
};
