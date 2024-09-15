import { obj } from './obj.mjs';

console.log(obj.observableInput1.value);
console.log(obj.observableInput2.value);
console.log(obj.getTotal());
console.log(obj.getTotalPlusOne());

obj.incInput1(5);
obj.incInput2(5);

console.log(obj.getTotal());
console.log('yes hello this is dog')