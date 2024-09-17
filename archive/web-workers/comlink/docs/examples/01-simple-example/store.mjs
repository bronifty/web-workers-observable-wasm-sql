import marcsObservable from "/dist/marcs-observable.js";

// const inputs = marcsObservable.create({
//   input1: 0,
//   input2: 0,
// });
// const total = marcsObservable.create(
//   () => (inputs.value.input1 || 0) * (inputs.value.input2 || 0)
// );

const observableInput1 = marcsObservable.create(0);
const observableInput2 = marcsObservable.create(0);
const observableTotal = marcsObservable.create(
  () => observableInput1.value * observableInput2.value
);
const observableTotalPlusOne = marcsObservable.create(
  () => observableTotal.value + 1
);

export { observableInput1, observableInput2, observableTotal, observableTotalPlusOne };
