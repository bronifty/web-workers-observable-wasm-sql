import {
  observableInput1,
  observableInput2,
  observableTotal,
} from "./store.mjs";

const first = document.querySelector("#number1");
const second = document.querySelector("#number2");
const result = document.querySelector(".result");
const total = document.querySelector(".total");

(() => {
  console.log("observableTotal.subscribe");
  observableTotal.subscribe((value) => {
    total.textContent = value;
  });
})();

if (window.Worker) {
  const myWorker = new Worker("worker.js");

  first.addEventListener("change", () => {
    // observableInput1.value = first.value;
    // console.log(JSON.stringify(observableInput1.value, null, 2));
    // console.log(JSON.stringify(observableInput2.value, null, 2));
    // console.log(JSON.stringify(observableTotal.value, null, 2));
    myWorker.postMessage({
      input: "observableInput1",
      value: observableInput1.value,
    });
    // myWorker.postMessage([first.value, second.value]);
    // console.log("Message posted to worker");
  });

  second.addEventListener("change", () => {
    // observableInput2.value = second.value;
    // console.log(JSON.stringify(observableInput1.value, null, 2));
    // console.log(JSON.stringify(observableInput2.value, null, 2));
    // console.log(JSON.stringify(observableTotal.value, null, 2));
    myWorker.postMessage({
      input: "observableInput2",
      value: observableInput2.value,
    });
    // myWorker.postMessage([first.value, second.value]);
    // console.log("Message posted to worker");
  });

  // [first, second].forEach((input) => {
  //   input.onchange = function () {
  //     myWorker.postMessage([first.value, second.value]);
  //     console.log("Message posted to worker");
  //   };
  // });

  myWorker.onmessage = function (e) {
    console.log(e.data);
    result.textContent = e.data;
    console.log("Message received from worker");
  };

  // total.textContent = total.value;
} else {
  console.log("Your browser doesn't support web workers.");
}
