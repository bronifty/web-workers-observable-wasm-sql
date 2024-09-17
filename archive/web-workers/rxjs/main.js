// Create a new web worker
const worker = new Worker("worker.js");

// Set up an observable in the main thread
const { fromEvent, Subject } = rxjs;
const workerSubject = new Subject();

// Listen for messages from the web worker
// fromEvent(worker, "message").subscribe((event) => {
//   workerSubject.next(event.data);
// });
worker.onmessage = function (event) {
  workerSubject.next(event.data);
};

// Send a message to the web worker
worker.postMessage({ action: "start", data: "syes hello this is dog" });

// Subscribe to the worker subject to get updates from the worker
workerSubject.subscribe((data) => {
  console.log("Data from worker:", data);
});
