import {
  observableInput1,
  observableInput2,
  observableTotal,
} from "./store.mjs";

self.onmessage = function (e) {
  console.log("Worker: Message received from main script");
  const result = e.data.input1 * e.data.input2;
  if (!isNaN(e.data.input1)) {
    observableInput1.value = Number(e.data.input1);
  }
  if (!isNaN(e.data.input2)) {
    observableInput2.value = Number(e.data.input2);
  }

  console.log(
    observableInput1.value,
    observableInput2.value,
    observableTotal.value
  );

  const workerResult = "Result: " + result;
  console.log("Worker: Posting message back to main script");
  console.log("Sending observableTotal:", observableTotal.value); // Debugging

  self.postMessage({ workerResult, observableTotal: observableTotal.value });
};
