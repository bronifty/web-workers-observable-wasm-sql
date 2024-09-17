const worker = new Worker("/src/worker.mjs", { type: "module" });
const log = console.log;

log("in main.mjs; worker.postMessage hello world");
worker.postMessage({
  type: "hello",
  payload: "world",
});

worker.onmessage = (e) => {
  log("in main.mjs; worker.onmessage", JSON.stringify(e.data, null, 2));
  const { type, payload } = e.data;
  if (type === "log") {
    console.log(payload);
  }
};
