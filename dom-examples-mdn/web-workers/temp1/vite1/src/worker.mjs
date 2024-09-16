import { inputs, total } from "./store.mjs";

// self.onmessage = function (e) {
//   const { input1, input2 } = e.data;
//   inputs.value = {
//     input1,
//     input2,
//   };
//   console.log("Worker: Message received from main script");
//   const result = e.data[0] * e.data[1];
//   if (isNaN(result)) {
//     postMessage("Please write two numbers");
//   } else {
//     const workerResult = result;
//     console.log("Worker: Posting message back to main script");
//     postMessage(workerResult);
//   }
// };

// src/worker.js
self.onmessage = function (e) {
  console.log("Worker: Message received from main script", e.data);
  const { input1, input2 } = e.data;
  inputs.value = {
    input1,
    input2,
  };
  // const result = input1 * input2;

  if (isNaN(result)) {
    console.log("Worker: Invalid input received");
    postMessage("Please provide two valid numbers");
  } else {
    console.log("Worker: Posting result back to main script", result);
    postMessage(result);
  }
};
