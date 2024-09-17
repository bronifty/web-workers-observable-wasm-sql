import {
  observableInput1,
  observableInput2,
  observableTotal,
} from "./store.mjs";

const first = document.querySelector("#number1");
const second = document.querySelector("#number2");
const result = document.querySelector(".result");
const total = document.querySelector(".total");

total.textContent = "test";
observableTotal.subscribe((value) => {
  total.textContent = value;
});
if (window.Worker) {
  const myWorker = new Worker("worker.mjs", { type: "module" });

  first.addEventListener("change", () => {
    myWorker.postMessage({ input1: first.value });
    console.log("Message posted to worker");
    // observableInput1.value = first.value;
    // observableInput2.value = second.value;
  });

  second.addEventListener("change", () => {
    myWorker.postMessage({ input2: second.value });
    console.log("Message posted to worker");
    // observableInput1.value = first.value;
    // observableInput2.value = second.value;
  });

  // [first, second].forEach((input) => {
  //   input.addEventListener("change", () => {
  //     myWorker.postMessage([first.value, second.value]);
  //     console.log("Message posted to worker");
  //   });
  // });

  myWorker.onmessage = function (e) {
    result.textContent = e.data.workerResult;
    console.log(e.data.observableTotal);
    total.textContent = e.data.observableTotal;
    console.log("Message received from worker");
  };
} else {
  console.log("Your browser doesn't support web workers.");
}
