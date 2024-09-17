// import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
// web-workers-observable-wasm-sql/opfs-vite/main.js

const mainPre = document.querySelector(".main");
const workerPre = document.querySelector(".worker");
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");

const log = (...args) => {
  console.log(...args);
  mainPre.textContent += `${args.join(" ")}\n`;
};
const error = (...args) => {
  console.error(...args);
  mainPre.textContent += `${args.join(" ")}\n`;
};

const workerLog = (...args) => {
  console.log(...args);
  workerPre.textContent += `${args.join(" ")}\n`;
};
const workerError = (...args) => {
  console.error(...args);
  workerPre.textContent += `${args.join(" ")}\n`;
};

// Initialize Worker
const worker = new Worker("/todos-worker.js", { type: "module" });
worker.onmessage = (e) => {
  const { type, payload } = e.data;
  if (type === "log") {
    workerLog(payload);
  } else if (type === "error") {
    workerError(payload);
  } else if (type === "todos") {
    renderTodos(payload);
  }
};

// Render Todos
const renderTodos = (todos) => {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = `${todo.id}: ${todo.title} - ${todo.description}`;
    todoList.appendChild(li);
  });
};

// Handle Form Submission
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (title && description) {
    // Send add_todo message to worker
    worker.postMessage({
      type: "add_todo",
      payload: { title, description },
    });

    // Clear form fields
    todoForm.reset();

    // Fetch updated todos
    worker.postMessage({ type: "get_todos" });
  }
});

// Initial Fetch of Todos
worker.postMessage({ type: "get_todos" });
