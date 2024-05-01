const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/job', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define todo schema and model
const todoSchema = new mongoose.Schema({
    text: String,
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to handle POST requests to add new todos
app.post('/todos', async (req, res) => {
    try {
        const { text } = req.body;
        const todo = new Todo({ text });
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).send('Error adding todo');
    }
});

// Define a route to handle DELETE requests to remove a todo
app.delete('/deleteItem', async (req, res) => {
    try {
        const { itemFromJS } = req.body;
        await Todo.deleteOne({ text: itemFromJS });
        console.log('Todo Deleted');
        res.json('Todo Deleted');
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo');
    }
});

// Define a route to fetch all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Error fetching todos');
    }
});

// Define a route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
