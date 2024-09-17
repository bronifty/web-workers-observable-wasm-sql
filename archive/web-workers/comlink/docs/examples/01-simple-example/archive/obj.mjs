import { observableInput1, observableInput2, observableTotal, observableTotalPlusOne } from './store.mjs';

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
      }
    };

    export {obj}