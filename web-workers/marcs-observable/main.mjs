import {
  observableInput1,
  observableInput2,
  observableTotal,
} from "./store.mjs";
// Create a new web worker
const worker = new Worker("worker.mjs", { type: "module" });

const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");
const total = document.querySelector("#total");

function handleInput({ element, value }) {
  worker.postMessage({ element, value });
}

input1.addEventListener("change", () =>
  handleInput({ element: "input1", value: input1.value })
);
input2.addEventListener("change", () =>
  handleInput({ element: "input2", value: input2.value })
);

worker.onmessage = function (event) {
  const { element, value } = event.data;
  console.log(
    `in main thread; worker.onmessage: ${JSON.stringify(
      { element, value },
      null,
      2
    )}`
  );
  if (element === "input1") {
    observableInput1.value = value;
  } else if (element === "input2") {
    observableInput2.value = value;
  }
};

(function () {
  observableTotal.subscribe((value) => {
    total.textContent = value;
  });
})();
