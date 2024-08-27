import { useState, useEffect } from 'react';
import { BsTrash } from 'react-icons/bs';
import axios from 'axios';

export default function TodoDetails({ todo, onTodoUpdate, onTodoDelete,onBack }) {
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editContent, setEditContent] = useState(todo.content);
    const [isEditing, setIsEditing] = useState(false);

    
    useEffect(() => {
        setEditTitle(todo.title);
        setEditContent(todo.content);
    }, [todo]);

    const handleSave = async () => {
        const updatedTodo = {
            ...todo,
            title: editTitle,
            content: editContent,
        };

        try {
            
            const response = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, updatedTodo);
            onTodoUpdate(response.data); 

            
            setEditTitle(response.data.title);
            setEditContent(response.data.content);

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDelete = async () => {
        try {
           
            await axios.delete(`http://localhost:5000/api/todos/${todo._id}`);
            onTodoDelete(todo._id);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="p-4 space-y-6 md:space-y-10">

            <button
                onClick={onBack}
                className="block md:hidden mb-4 bg-black px-3 py-2 text-white rounded-md"
            >
                &larr; Back
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                
                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-2xl md:text-4xl font-bold  border-black focus:outline-none"
                    />
                ) : (
                    <h3 className="text-2xl md:text-4xl font-bold break-words">{editTitle}</h3>
                )}

                
                <div className="flex items-center mt-4 md:mt-0 space-x-2 md:space-x-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-black text-white px-3 py-2 md:px-4 md:py-2 rounded hover:bg-gray-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete} 
                        className="text-gray-500 hover:text-red-500"
                    >
                        <BsTrash size={20} />
                    </button>
                </div>
            </div>

            <hr className="border-b-2 border-black" />

            
            <div className="my-4">
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border p-2 rounded-md resize-none focus:outline-none"
                        rows="10"
                    />
                ) : (
                    <p className="text-lg break-words">{editContent}</p>
                )}
            </div>

           
            {isEditing && (
                <div className="flex justify-end space-x-2 md:space-x-4">
                    <button
                        onClick={handleSave}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}



