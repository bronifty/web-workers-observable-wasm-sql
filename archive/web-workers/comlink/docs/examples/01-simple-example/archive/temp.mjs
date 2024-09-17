import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
    // import * as Comlink from "../../../dist/esm/comlink.mjs";

// import {obj} from "./obj.mjs";

    


    async function init() {
      const {obj} =  import("./obj.mjs");
      // ... existing code ...
    
      // Use the object methods instead of directly accessing observables
      obj.incInput1(1);
      obj.incInput2(1);
      obj.incInput1(1);
      obj.incInput2(1);
    
      result3.textContent = obj.getTotal();
    }
    
    init();


    // const obj2 = {
    //   observableInput1,
    //   observableInput2,
    //   observableTotal,
    //   counter: 0,
    //   inc() {
    //     this.counter = this.counter + 1;
    //   },
    //   incInput1(value) {
    //     this.observableInput1.value = this.observableInput1.value + value;
    //   },
    //   incInput2(value) {
    //     this.observableInput2.value = this.observableInput2.value + value;
    //   },
    //   result3() {
    //     return this.observableTotal.value;
    //   }
    // };

    const input1 = document.querySelector("#input1");
    const input2 = document.querySelector("#input2");
    const result = document.querySelector("#result");
    const result2 = document.querySelector("#result2");
    
  
    // async function init() {

    //   observableTotal.subscribe((value) => {
    //     result2.textContent = value;
    //   });
    //   input1.addEventListener("change", (e) => {
    //     observableInput1.value = Number(e.target.value);
    //   });
    //   input2.addEventListener("change", (e) => {
    //     observableInput2.value = Number(e.target.value);
    //   });

    //   const worker = new Worker("worker.mjs");
    //   const obj = Comlink.wrap(worker);
    //   result.textContent = "Loading...";
    //   result.textContent = await obj.counter;
    //   await obj.inc();
    //   result.textContent = await obj.counter;
      
    //   // const worker2 = new Worker("worker2.mjs");
    //   // const obj2 = Comlink.wrap(worker2);
    //   // result2.textContent = await obj2.observableTotal.value;
    //   //  obj2.incInput1();
    //   //  obj2.incInput2();
    //   // observableInput1.value = observableInput1.value + 1;
    //   // observableInput2.value = observableInput2.value + 1;
    //   // result2.textContent = observableTotal.value;
    //   obj2.incInput1();
    //   obj2.incInput2();
    //   obj2.incInput1();
    //   obj2.incInput2();

    //   result3.textContent =  Number(obj2.result3());
      
    // }
  
    // init();