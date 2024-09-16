import marcsObservable from "@bronifty/marcs-observable";

const inputs = marcsObservable.create({
  input1: 0,
  input2: 0,
});

const total = marcsObservable.create(
  () => (inputs.value.input1 || 0) * (inputs.value.input2 || 0)
);

export { inputs, total };
