// Initialize the Web Worker
const worker = new Worker(new URL('./worker2.js', import.meta.url), {
  type: 'module',
});

const mainLog = document.querySelector('pre.main');
const workerLog = document.querySelector('pre.worker');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function log(message) {
  mainLog.textContent += message + '\n';
}

// ... (previous code remains the same)

// Function to query the database via the worker
const queryDatabase = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const messageHandler = (event) => {
      if (event.data.type === 'queryResult') {
        worker.removeEventListener('message', messageHandler);
        resolve(event.data.payload);
      } else if (event.data.type === 'error') {
        worker.removeEventListener('message', messageHandler);
        reject(new Error(event.data.payload));
      } else if (event.data.type === 'log') {
        workerLog.textContent += event.data.payload + '\n';
      }
    };

    worker.addEventListener('message', messageHandler);
    worker.postMessage({ query, params });
  });
};

// ... (previous code remains the same)

// Fetch and display todos
const displayTodos = async () => {
  try {
    const query = 'SELECT * FROM todos ORDER BY id;';
    const results = await queryDatabase(query);

    console.log('Query results:', results);

    // Check if results is an array and has at least one item with values
    if (
      !Array.isArray(results) ||
      results.length === 0 ||
      !results[0].values ||
      results[0].values.length === 0
    ) {
      log('No todos found');
      todoList.innerHTML = '<li>No todos yet. Add one above!</li>';
      return;
    }

    const todos = results[0].values;

    todoList.innerHTML = '';
    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="${todo.completed ? 'completed' : ''}">${todo.task}</span>
        <span class="delete-btn">❌</span>
      `;
      li.dataset.id = todo.id;

      // Toggle todo completion
      li.querySelector('input[type="checkbox"]').addEventListener(
        'change',
        (e) => {
          toggleTodo(todo.id, e.target.checked);
        },
      );

      // Delete todo
      li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(todo.id);
      });

      todoList.appendChild(li);
    });
    log('Todos fetched and displayed successfully');
  } catch (error) {
    log('Error fetching todos: ' + error.message);
    console.error('Error details:', error);
  }
};

// ... (rest of the code remains the same)

// ... (previous code remains the same)

// Add a new todo
const addTodo = async (task) => {
  if (!task || task.trim() === '') {
    log('Cannot add empty todo');
    return;
  }
  try {
    console.log('Attempting to add todo:', task);
    const result = await queryDatabase('INSERT INTO todos (task) VALUES (?)', [
      task.trim(),
    ]);
    console.log('Insert result:', result);
    if (result.affectedRows > 0) {
      log('Todo added successfully');
      displayTodos(); // Refresh the list
    } else {
      log('Failed to add todo');
    }
  } catch (error) {
    log('Error adding todo: ' + error.message);
    console.error('Error details:', error);
  }
};

// ... (rest of the code remains the same)

// Toggle todo completion
const toggleTodo = async (id, completed) => {
  try {
    const result = await queryDatabase(
      'UPDATE todos SET completed = ? WHERE id = ?',
      [completed ? 1 : 0, id],
    );
    if (result.affectedRows > 0) {
      log('Todo updated successfully');
      displayTodos(); // Refresh the list
    } else {
      log('Failed to update todo');
    }
  } catch (error) {
    log('Error updating todo: ' + error.message);
  }
};

// Delete a todo
const deleteTodo = async (id) => {
  try {
    const result = await queryDatabase('DELETE FROM todos WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      log('Todo deleted successfully');
      displayTodos(); // Refresh the list
    } else {
      log('Failed to delete todo');
    }
  } catch (error) {
    log('Error deleting todo: ' + error.message);
  }
};

// ... (rest of the code remains the same)

// Event listener for adding a new todo
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = todoInput.value.trim();
  console.log('Form submitted with task:', task);
  if (task) {
    addTodo(task);
    todoInput.value = '';
  } else {
    log('Cannot add empty todo');
  }
});

// Wait for the worker to be ready
worker.addEventListener('message', (event) => {
  if (event.data.type === 'ready') {
    log('Worker is ready. Fetching todos...');
    displayTodos();
  } else if (event.data.type === 'log' || event.data.type === 'error') {
    console.log('Worker:', event.data.payload);
  }
});
