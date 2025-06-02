'use client'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchConversations,
    fetchConversationByTitle,
    setCurrConvo,
} from '@/app/store/slices/conversationSlice'

function TestComp() {
    const dispatch = useDispatch()
    const {
        conversations,
        selectedConversation,
        currConvo,
        loading,
        error,
    } = useSelector((state) => state.conversation)

    useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

    // Handle clicking on a conversation title
    const handleSelectConversation = (title) => {
        dispatch(setCurrConvo(title))
        dispatch(fetchConversationByTitle(title))
    }

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <ul>
                {conversations.map((c) => (
                    <li
                        key={c.id || c.title}
                        style={{ cursor: 'pointer', fontWeight: currConvo === c.title ? 'bold' : 'normal' }}
                        onClick={() => handleSelectConversation(c.title)}
                    >
                        {c.title}
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: 20 }}>
                <h3>Messages for: {currConvo || 'None selected'}</h3>
                {selectedConversation && selectedConversation.messages?.length > 0 ? (
                    <ul>
                        {selectedConversation.messages.map((msg, index) => (
                            <li key={index}>
                                <strong>{msg.role}: </strong> {msg.content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>

        </div>
    )
}

export default TestComp

// 'use client'

// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//     fetchConversationByTitle,
//     createConversation,
//     addMessagesToConversation,
//     deleteConversation,
//     setMsg,
//     setCurrConvo,
// } from '@/app/store/slices/conversationSlice'

// export default function Home() {
//     const dispatch = useDispatch()
//     const {
//         conversations,
//         selectedConversation,
//         msg,
//         currConvo,
//         loading,
//         error,
//     } = useSelector((state) => state.conversation)

//     const [title, setTitle] = useState('')
//     const [message, setMessage] = useState('')

//     useEffect(() => {
//         dispatch(fetchConversations())
//     }, [dispatch])

//     const handleCreate = () => {
//         dispatch(createConversation({ title, messages: [] }))
//         setTitle('')
//     }

//     const handleSend = () => {
//         if (currConvo) {
//             dispatch(addMessagesToConversation({ title: currConvo, messages: [message] }))
//             setMessage('')
//         }
//     }

//     return (
//         <div>
//             <h1>Conversations</h1>

//             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Title" />
//             <button onClick={handleCreate}>Create</button>

//             <br />
//             <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send Message" />
//             <button onClick={handleSend}>Send</button>

//             {loading && <p>Loading...</p>}
//             {error && <p>Error: {error.message}</p>}

//             <ul>
//                 {conversations.map((c) => (
//                     <li key={c.title}>
//                         <span onClick={() => dispatch(setCurrConvo(c.title))}>{c.title}</span> ({c.messages.length})
//                         <button onClick={() => dispatch(deleteConversation(c.title))}>Delete</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }

// // 'use client'

// // import { useDispatch, useSelector } from 'react-redux'
// // // import { addConversation, addMessageToConversation } from './store/slices/conversationSlice'
// // import { addConversation, addMessageToConversation } from '@/app/store/slices/conversationSlice'
// // import { useState } from 'react'
// // import { v4 as uuidv4 } from 'uuid'

// // export default function Home() {
// //     const dispatch = useDispatch()
// //     const conversations = useSelector((state) => state.conversation.conversations)
// //     const [title, setTitle] = useState('')
// //     const [message, setMessage] = useState('')
// //     const [selectedId, setSelectedId] = useState(null)

// //     const handleAddConversation = () => {
// //         const id = uuidv4()
// //         dispatch(addConversation({ id, title }))
// //         setSelectedId(id)
// //         setTitle('')
// //     }

// //     const handleSendMessage = () => {
// //         if (selectedId) {
// //             dispatch(addMessageToConversation({ id: selectedId, message }))
// //             setMessage('')
// //         }
// //     }

// //     return (
// //         <div>
// //             <h2>Add New Conversation</h2>
// //             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Conversation Title" />
// //             <button onClick={handleAddConversation}>Create</button>

// //             <h2>Send Message</h2>
// //             <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
// //             <button onClick={handleSendMessage} disabled={!selectedId}>Send</button>

// //             <h3>Conversations:</h3>
// //             <ul>
// //                 {conversations.map((conv) => (
// //                     <li key={conv.id} onClick={() => setSelectedId(conv.id)} style={{ cursor: 'pointer' }}>
// //                         <strong>{conv.title}</strong> ({conv.messages.length} messages)
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     )
// // }

// // // 'use client'

// // // import { useSelector, useDispatch } from 'react-redux'
// // // // import { increment, decrement } from './store/slices/counterSlice'
// // // import { increment, decrement } from '@/app/store/slices/counterSlice'

// // // const TestComp = () => {
// // //     const count = useSelector((state) => state.counter.value)
// // //     const dispatch = useDispatch()

// // //     return (
// // //         <main>
// // //             <h1>Count: {count}</h1>
// // //             <button onClick={() => dispatch(increment())}>+</button>
// // //             <button onClick={() => dispatch(decrement())}>-</button>
// // //         </main>
// // //     )
// // // }

// // // export default TestComp

// // // const TestComp = () => {
// // //     return (
// // //         <p>testComp</p>
// // //     );
// // // };
// // // export default TestComp;