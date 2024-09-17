import {
  observableInput1,
  observableInput2,
  observableTotal,
  observableTotalPlusOne,
} from "./store.mjs";

const obj = {
  observableInput1,
  observableInput2,
  observableTotal,
  observableTotalPlusOne,
  incInput1(value) {
    this.observableInput1.value += value;
  },
  incInput2(value) {
    this.observableInput2.value += value;
  },
  getTotal() {
    return this.observableTotal.value;
  },
  getTotalPlusOne() {
    return this.observableTotalPlusOne.value;
  },
};

self.onmessage = function (e) {
  console.log("Worker: Message received from main script");
  const result = e.data[0] * e.data[1];
  if (isNaN(result)) {
    postMessage("Please write two numbers");
  } else {
    const workerResult = "Result: " + result;
    console.log("Worker: Posting message back to main script");
    postMessage(workerResult);
  }
};
