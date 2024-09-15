import {
  observableInput1,
  observableInput2,
  observableTotal,
} from "./store.mjs";

self.onmessage = function (e) {
  console.log("Worker: Message received from main script");
  const result = e.data[0] * e.data[1];
  observableInput1.value = e.data[0];
  observableInput2.value = e.data[1];
  console.log(
    observableInput1.value,
    observableInput2.value,
    observableTotal.value
  );
  if (isNaN(result)) {
    postMessage("Please write two numbers");
  } else {
    const workerResult = "Result: " + result;
    console.log("Worker: Posting message back to main script");
    postMessage(workerResult);
  }
};
