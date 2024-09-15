function handleInput(element, value) {
  worker.postMessage(element, value);
}

// Listen for messages from the main thread
self.onmessage = function (event) {
  const { element, value } = event.data;
  console.log(`worker element: ${element}`);
  console.log(`worker value: ${value}`);

  console.log(
    `self.postMessage: ${JSON.stringify({ element, value }, null, 2)}`
  );
  self.postMessage({ element, value });
};
