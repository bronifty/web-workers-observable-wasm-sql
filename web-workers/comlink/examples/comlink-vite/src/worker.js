import * as Comlink from "comlink";

importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
// importScripts("../../../dist/umd/comlink.js");

const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
};

Comlink.expose(obj);
