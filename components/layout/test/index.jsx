'use client';
import { useEffect, useState } from 'react';

export default function Test() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [edit, setEdit] = useState(null);

    const loadTodos = async () => {
        const res = await fetch('/api/todos');
        const data = await res.json();
        setTodos(data);
    };

    const handleAdd = async () => {
        if (!title) return;
        await fetch('/api/todos', {
            method: 'POST',
            body: JSON.stringify({ title }),
        });
        setTitle('');
        loadTodos();
    };

    const handleUpdate = async () => {
        await fetch('/api/todos', {
            method: 'PUT',
            body: JSON.stringify({ id: edit.id, title }),
        });
        setTitle('');
        setEdit(null);
        loadTodos();
    };

    const handleDelete = async (id) => {
        await fetch('/api/todos', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
        loadTodos();
    };

    useEffect(() => {
        loadTodos();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Todo List</h1>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New todo..."
                style={{ marginRight: 10 }}
            />
            <button onClick={edit ? handleUpdate : handleAdd}>
                {edit ? 'Update' : 'Add'}
            </button>

            <ul style={{ marginTop: 20 }}>
                {todos.map((todo) => (
                    <li key={todo.id} style={{ marginBottom: 10 }}>
                        {todo.title}
                        <button onClick={() => {
                            setTitle(todo.title);
                            setEdit(todo);
                        }} style={{ marginLeft: 10 }}>Edit</button>
                        <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: 10 }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// "use client"
// import { useState } from 'react';
// import { Edit, Check, X } from 'lucide-react';

// const TestComp = ({ onConversationSelect }) => {

//     const items = [
//         {
//             id: "1749136936423",
//             title: "My first chat3",
//             messages: [
//                 { role: "user", content: "hhehehe me a joke." },
//                 { role: "assistant", content: "Whyfefe did the AI cross the road? To optimize the other side!" }
//             ]
//         },
//         {
//             id: "1749136945975",
//             title: "My first chat2",
//             messages: [
//                 { role: "user", content: "hhehehe me a joke." },
//                 { role: "assistant", content: "Whyfefe did the AI cross the road? To optimize the other side!" }
//             ]
//         },
//         {
//             id: "1749136949590",
//             title: "My first chat1",
//             messages: [
//                 { role: "user", content: "hhehehe me a joke." },
//                 { role: "assistant", content: "Whyfefe did the AI cross the road? To optimize the other side!" }
//             ]
//         }
//     ];

//     const [editedId, setEditedId] = useState(null); // Track the ID of the conversation being edited
//     const [editedTitle, setEditedTitle] = useState(''); // Track the edited title

//     // Handle title edit button click
//     const handleEditClick = (id, title) => {
//         setEditedId(id);
//         setEditedTitle(title);
//     };

//     // Handle title change
//     const handleTitleChange = (e) => {
//         setEditedTitle(e.target.value);
//     };

//     // Save the edited title
//     const handleSaveClick = () => {
//         // Save logic (e.g., API call to update)
//         setEditedId(null); // End editing
//     };

//     // Cancel the edit
//     const handleCancelClick = () => {
//         setEditedId(null); // End editing without saving
//     };

//     return (
//         <div>
//             <h2>Platform</h2>
//             <div>
//                 {items?.map((item) => (
//                     <div key={item.id} className="item">
//                         <div className="flex items-center space-x-2">
//                             {editedId === item.id ? (
//                                 <input
//                                     type="text"
//                                     value={editedTitle}
//                                     onChange={handleTitleChange}
//                                     className="border p-1"
//                                 />
//                             ) : (
//                                 <h3>{item.title}</h3>
//                             )}
//                             <div className="flex space-x-2">
//                                 {editedId === item.id ? (
//                                     <>
//                                         <Check onClick={handleSaveClick} size={16} />
//                                         <X onClick={handleCancelClick} size={16} />
//                                     </>
//                                 ) : (
//                                     <Edit onClick={() => handleEditClick(item.id, item.title)} size={16} />
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default TestComp;


// // 'use client'
// // import { useEffect } from 'react'
// // import { useSelector, useDispatch } from 'react-redux'
// // import {
// //     fetchConversations,
// //     fetchConversationByTitle,
// //     setCurrConvo,
// // } from '@/app/store/slices/conversationSlice'

// // function TestComp() {
// //     const dispatch = useDispatch()
// //     const {
// //         conversations,
// //         selectedConversation,
// //         currConvo,
// //         loading,
// //         error,
// //     } = useSelector((state) => state.conversation)

// //     useEffect(() => {
// //         dispatch(fetchConversations())
// //     }, [dispatch])

// //     // Handle clicking on a conversation title
// //     const handleSelectConversation = (title) => {
// //         dispatch(setCurrConvo(title))
// //         dispatch(fetchConversationByTitle(title))
// //     }

// //     return (
// //         <div>
// //             {loading && <p>Loading...</p>}
// //             {error && <p>Error: {error}</p>}

// //             <ul>
// //                 {conversations.map((c) => (
// //                     <li
// //                         key={c.id || c.title}
// //                         style={{ cursor: 'pointer', fontWeight: currConvo === c.title ? 'bold' : 'normal' }}
// //                         onClick={() => handleSelectConversation(c.title)}
// //                     >
// //                         {c.title}
// //                     </li>
// //                 ))}
// //             </ul>

// //             <div style={{ marginTop: 20 }}>
// //                 <h3>Messages for: {currConvo || 'None selected'}</h3>
// //                 {selectedConversation && selectedConversation.messages?.length > 0 ? (
// //                     <ul>
// //                         {selectedConversation.messages.map((msg, index) => (
// //                             <li key={index}>
// //                                 <strong>{msg.role}: </strong> {msg.content}
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 ) : (
// //                     <p>No messages to display.</p>
// //                 )}
// //             </div>

// //         </div>
// //     )
// // }

// // export default TestComp

// // // 'use client'

// // // import { useEffect, useState } from 'react'
// // // import { useDispatch, useSelector } from 'react-redux'
// // // import {
// // //     fetchConversationByTitle,
// // //     createConversation,
// // //     addMessagesToConversation,
// // //     deleteConversation,
// // //     setMsg,
// // //     setCurrConvo,
// // // } from '@/app/store/slices/conversationSlice'

// // // export default function Home() {
// // //     const dispatch = useDispatch()
// // //     const {
// // //         conversations,
// // //         selectedConversation,
// // //         msg,
// // //         currConvo,
// // //         loading,
// // //         error,
// // //     } = useSelector((state) => state.conversation)

// // //     const [title, setTitle] = useState('')
// // //     const [message, setMessage] = useState('')

// // //     useEffect(() => {
// // //         dispatch(fetchConversations())
// // //     }, [dispatch])

// // //     const handleCreate = () => {
// // //         dispatch(createConversation({ title, messages: [] }))
// // //         setTitle('')
// // //     }

// // //     const handleSend = () => {
// // //         if (currConvo) {
// // //             dispatch(addMessagesToConversation({ title: currConvo, messages: [message] }))
// // //             setMessage('')
// // //         }
// // //     }

// // //     return (
// // //         <div>
// // //             <h1>Conversations</h1>

// // //             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Title" />
// // //             <button onClick={handleCreate}>Create</button>

// // //             <br />
// // //             <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send Message" />
// // //             <button onClick={handleSend}>Send</button>

// // //             {loading && <p>Loading...</p>}
// // //             {error && <p>Error: {error.message}</p>}

// // //             <ul>
// // //                 {conversations.map((c) => (
// // //                     <li key={c.title}>
// // //                         <span onClick={() => dispatch(setCurrConvo(c.title))}>{c.title}</span> ({c.messages.length})
// // //                         <button onClick={() => dispatch(deleteConversation(c.title))}>Delete</button>
// // //                     </li>
// // //                 ))}
// // //             </ul>
// // //         </div>
// // //     )
// // // }

// // // // 'use client'

// // // // import { useDispatch, useSelector } from 'react-redux'
// // // // // import { addConversation, addMessageToConversation } from './store/slices/conversationSlice'
// // // // import { addConversation, addMessageToConversation } from '@/app/store/slices/conversationSlice'
// // // // import { useState } from 'react'
// // // // import { v4 as uuidv4 } from 'uuid'

// // // // export default function Home() {
// // // //     const dispatch = useDispatch()
// // // //     const conversations = useSelector((state) => state.conversation.conversations)
// // // //     const [title, setTitle] = useState('')
// // // //     const [message, setMessage] = useState('')
// // // //     const [selectedId, setSelectedId] = useState(null)

// // // //     const handleAddConversation = () => {
// // // //         const id = uuidv4()
// // // //         dispatch(addConversation({ id, title }))
// // // //         setSelectedId(id)
// // // //         setTitle('')
// // // //     }

// // // //     const handleSendMessage = () => {
// // // //         if (selectedId) {
// // // //             dispatch(addMessageToConversation({ id: selectedId, message }))
// // // //             setMessage('')
// // // //         }
// // // //     }

// // // //     return (
// // // //         <div>
// // // //             <h2>Add New Conversation</h2>
// // // //             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Conversation Title" />
// // // //             <button onClick={handleAddConversation}>Create</button>

// // // //             <h2>Send Message</h2>
// // // //             <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
// // // //             <button onClick={handleSendMessage} disabled={!selectedId}>Send</button>

// // // //             <h3>Conversations:</h3>
// // // //             <ul>
// // // //                 {conversations.map((conv) => (
// // // //                     <li key={conv.id} onClick={() => setSelectedId(conv.id)} style={{ cursor: 'pointer' }}>
// // // //                         <strong>{conv.title}</strong> ({conv.messages.length} messages)
// // // //                     </li>
// // // //                 ))}
// // // //             </ul>
// // // //         </div>
// // // //     )
// // // // }

// // // // // 'use client'

// // // // // import { useSelector, useDispatch } from 'react-redux'
// // // // // // import { increment, decrement } from './store/slices/counterSlice'
// // // // // import { increment, decrement } from '@/app/store/slices/counterSlice'

// // // // // const TestComp = () => {
// // // // //     const count = useSelector((state) => state.counter.value)
// // // // //     const dispatch = useDispatch()

// // // // //     return (
// // // // //         <main>
// // // // //             <h1>Count: {count}</h1>
// // // // //             <button onClick={() => dispatch(increment())}>+</button>
// // // // //             <button onClick={() => dispatch(decrement())}>-</button>
// // // // //         </main>
// // // // //     )
// // // // // }

// // // // // export default TestComp

// // // // // const TestComp = () => {
// // // // //     return (
// // // // //         <p>testComp</p>
// // // // //     );
// // // // // };
// // // // // export default TestComp;