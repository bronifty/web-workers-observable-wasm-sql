import React from "react";
import { total } from "./store.mjs";

import "./App.css";
let unsubscribe = () => {};
let worker: Worker;
function App() {
  const defaultValues = { controlledInput1: 0, controlledInput2: 0 };
  const [fields, setFields] = React.useState(defaultValues);
  const setField = (field: string, value: number) => {
    setFields((old) => ({ ...old, [field]: value }));
    console.log(`worker.postMessage(fields)`, JSON.stringify(fields, null, 2));
    worker.postMessage(fields);
    // inputs.value = {
    //   ...fields,
    //   [field]: value,
    // };
  };

  const [_, setSub] = React.useState(total.value);

  React.useEffect(() => {
    worker = new Worker(new URL("./worker.mjs", import.meta.url));
    unsubscribe = total.subscribe((newVal: any) => {
      setSub(newVal);
    });
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      <form>
        <div>
          <label htmlFor="input1">Multiply number 1: </label>
          <input
            type="number"
            id="controlledInput1"
            value={fields.controlledInput1}
            onChange={(e) =>
              setField("controlledInput1", Number(e.target.value))
            }
          />
        </div>
        <div>
          <label htmlFor="input2">Multiply number 2: </label>
          <input
            type="number"
            id="controlledInput2"
            value={fields.controlledInput2}
            onChange={(e) =>
              setField("controlledInput2", Number(e.target.value))
            }
          />
        </div>
      </form>
      <div>
        <p>Result: {total.value}</p>
      </div>
    </>
  );
}

export default App;
