import {
  observableInput1,
  observableInput2,
  observableTotal,
} from "./store.mjs";

// Listen for messages from the main thread
self.onmessage = function (event) {
  const { element, value } = event.data;
  console.log(`worker element: ${element}`);
  console.log(`worker value: ${value}`);
  if (element === "input1") {
    observableInput1.value = value;
  } else if (element === "input2") {
    observableInput2.value = value;
  }

  console.log(`observableTotal: ${observableTotal.value}`);
  self.postMessage(observableTotal.value);
};
