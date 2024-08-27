import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoDetails from './TodoDetails';
import { IoIosSearch } from "react-icons/io";
import { CgFileAdd } from "react-icons/cg";

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoContent, setNewTodoContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');  // State for search query
    

    
    useEffect(() => {
        axios.get('http://localhost:5000/api/todos')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }, []);

    const handleTodoSelect = (todo) => {
        setSelectedTodo(todo);
        setShowAddForm(false);
    };

    const handleTodoUpdate = (updatedTodo) => {
        // Update the todo in the state
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo._id === updatedTodo._id ? updatedTodo : todo
            )
        );
    };

    const handleAddTodo = () => {
        const newTodo = {
            title: newTodoTitle,
            content: newTodoContent,
        };

        axios.post('http://localhost:5000/api/todos', newTodo)
            .then(response => {
                setTodos([...todos, response.data]);
                setShowAddForm(false);
                setSelectedTodo(response.data);
                setNewTodoTitle('');
                setNewTodoContent('');
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    };

    const handleTodoDelete = (todoId) => {
        axios.delete(`http://localhost:5000/api/todos/${todoId}`)
            .then(() => {
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId));
                setSelectedTodo(null);
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };

    
    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row md:mx-20 h-screen">
            
            <div className={`w-full md:w-2/5 p-4 ${selectedTodo && 'hidden md:block'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div className='flex gap-4'>
                        <button
                            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-700 shadow-xl flex gap-2"
                            onClick={() => {
                                setShowAddForm(true);
                                setSelectedTodo(null);
                            }}
                        >
                            <CgFileAdd size={20} />
                            Todo
                        </button>
                        <div className='relative'>
                            <div
                                className=' flex items-center w-4/5 relative ' >
                                
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className=' bg-white py-3 w-full shadow-lg rounded-lg'
                                />
                                <IoIosSearch size={30} className='absolute right-2'/>
                            </div>
                            
                        </div>
                    </div>
                </div>
                {filteredTodos.map((todo) => (
                    <div
                        key={todo._id}
                        className={`p-2 border-b cursor-pointer bg-white mb-4 rounded-xl shadow-lg`}
                        onClick={() => handleTodoSelect(todo)}
                    >
                        <h4 className="text-lg font-bold mb-2">{todo.title}</h4>
                        <p className='mb-2'>{todo.content.substring(0, 50)}...</p>
                        <p className="text-sm text-gray-500 text-right">{new Date(todo.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            
            <div className={`w-full md:w-3/5 p-4 bg-white shadow-lg rounded-xl ${!selectedTodo && !showAddForm ? 'hidden md:block' : ''}`}>
                {showAddForm ? (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">Add New Todo</h3>
                        <input
                            type="text"
                            placeholder="ADD TITLE"
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <textarea
                            placeholder="CONTENT......."
                            value={newTodoContent}
                            onChange={(e) => setNewTodoContent(e.target.value)}
                            className="w-full p-2 mb-2 rounded resize-none border"
                            rows="20"
                        />
                        <button
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                            onClick={handleAddTodo}
                        >
                            Add Todo
                        </button>
                    </div>
                ) : (
                    selectedTodo ? (
                        <TodoDetails
                            todo={selectedTodo}
                            onTodoUpdate={handleTodoUpdate}
                            onTodoDelete={handleTodoDelete}
                            onBack={() => setSelectedTodo(null)} 
                        />
                    ) : (
                        <div className='text-xl font-semibold'>Select a todo to see the details or add a new todo.</div>
                    )
                )}
            </div>
        </div>
    );
}
