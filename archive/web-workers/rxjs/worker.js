// Listen for messages from the main thread
self.onmessage = function (event) {
  const { action, data } = event.data;
  if (action === "start") {
    // Do some work and send a message back to the main thread
    self.postMessage(`Processed data: ${data}`);
  }
};
