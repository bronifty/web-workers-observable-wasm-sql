const log = console.log;
self.onmessage = (e) => {
  log("in worker.mjs; self.onmessage", JSON.stringify(e.data, null, 2));
  const { type, payload } = e.data;

  log("in worker.mjs; self.postMessage type log payload worker initialized");
  self.postMessage({ type: "log", payload: "worker initialized" });
};
