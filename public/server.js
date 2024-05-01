        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('todo-form');
            const input = document.getElementById('todo-input');
            const todoList = document.getElementById('todo-list');

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const todoText = input.value.trim();
                if (todoText) {
                    const todoItem = createTodoItem(todoText);
                    todoList.appendChild(todoItem);
                    input.value = '';

                    // Send a POST request to add todo
                    await fetch('/todos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: todoText }),
                    });
                }
            });

            // Function to create todo item
            function createTodoItem(text) {
                const todoItem = document.createElement('li');
                todoItem.className = 'todo-item';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                const todoText = document.createElement('span');
                todoText.textContent = text;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', async () => {
                    todoItem.remove();
                    // Send a DELETE request to remove todo
                    await fetch(`/deleteItem`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ itemFromJS: text }), // Send the todo text to be deleted
                    });
                });

                todoItem.appendChild(checkbox);
                todoItem.appendChild(todoText);
                todoItem.appendChild(deleteButton);

                return todoItem;
            }

            // Fetch todos from server on page load
            async function fetchTodos() {
                const response = await fetch('/todos');
                const todos = await response.json();
                todos.forEach(todo => {
                    const todoItem = createTodoItem(todo.text);
                    todoItem.dataset.id = todo._id; // Store todo ID as a data attribute
                    todoList.appendChild(todoItem);
                });
            }

            fetchTodos();
        });
