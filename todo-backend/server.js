const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));



mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));


const TodoSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', TodoSchema);


app.post('/api/todos', async (req, res) => {
    try {
        const newTodo = new Todo({
            title: req.body.title,
            content: req.body.content,
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: error.message });
    }
});


app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: error.message });
    }
});


app.put('/api/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
            },
            { new: true } 
        );
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: error.message });
    }
});


app.delete('/api/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: error.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
