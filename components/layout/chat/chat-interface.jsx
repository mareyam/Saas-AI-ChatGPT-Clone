'use client'
import { useEffect, useRef, useState } from "react";
import { Send, Menu, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChatMessage } from "./chat-message";
import { ChatGPTModelSelection } from "./model-selection";
import { useModels } from "@/hooks/useModels";
import Image from "next/image";
import CustomGPT from "./custom-gpt";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversationByTitle, createConversation, addMessagesToConversation } from "@/app/store/slices/conversationSlice";
import CreateConversationTitle from "./create-conversation-title";
import ChatInterfaceHeader from "../chat-interface/header";
import ScrollViewMessages from "../chat-interface/scrollview-messages";
import InputArea from "../chat-interface/input-area";

export function ChatInterface() {

    const { selectedModel } = useModels();
    const fileInputRef = useRef(null);
    const [image, setImage] = useState('');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([])
    const [title, setTitle] = useState("")
    const [newChat, setNewChat] = useState(false)
    const dispatch = useDispatch();
    const currConvo = useSelector((state) => state.conversation.currConvo);
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);


    useEffect(() => {
        if (selectedConversation?.messages?.length) {
            setMessages(selectedConversation.messages)
        } else {
            setMessages([])
        }
    }, [selectedConversation])


    useEffect(() => {

        if (selectedConversation?.messages?.length) {
            setMessages(selectedConversation.messages);
            // console.log(messages)
        }
    }, [selectedConversation]);


    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl)
        // console.log("Selected image URL:", imageUrl);
    };




    const handleImageSend = async () => {
        if (!image.trim()) return;

        // Add user message locally with base64 preview (optional)
        const userMessage = {
            id: Date.now().toString(),
            content: input || '[Image uploaded]',
            image,
            role: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setImage('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: input || "What's in this image?" },
                                {
                                    type: 'image_url',
                                    image_url: { url: image }
                                }
                            ],
                        },
                    ],
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: data.result,
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: (Date.now() + 2).toString(),
                content: `Error: ${error.message}`,
                role: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading)
                handleSendMessage()
        }
    };

    useEffect(() => {
        if (currConvo) {
            dispatch(fetchConversationByTitle(currConvo));
        }
    }, [currConvo, dispatch]);

    const handleNewChatSend = () => {
        setNewChat(true)
        const userMessage = {
            id: Date.now().toString(),
            content: input || "[Image Uploaded]",
            image,
            role: 'user',
            timestamp: new Date(),
        };

        const aiMessage = {
            id: (Date.now() + 1).toString(),
            content: "Why did the AI cross the road? To optimize the other side!",
            role: "assistant",
            timestamp: new Date(),
        };

        const newMessages = [
            { role: userMessage.role, content: userMessage.content },
            { role: aiMessage.role, content: aiMessage.content },
        ];
        setMessages(prev => [...prev, userMessage, aiMessage]);

        // Save to backend
        dispatch(createConversation({ title, messages: newMessages }))
            .unwrap()
            .then((data) => console.log("Conversation created:", data))
            .catch((error) => console.error("Failed to create conversation:", error));

        console.log("create convo", title, newMessages);
        setNewChat(false)
    };

    const handleNewChatExisting = () => {
        console.log(title + "existing chat")
        const userMessage = {
            id: Date.now().toString(),
            content: input || "[Image Uploaded]",
            image,
            role: 'user',
            timestamp: new Date(),
        };

        const aiMessage = {
            id: (Date.now() + 1).toString(),
            content: "Why did the AI cross the road? To optimize the other side!",
            role: "assistant",
            timestamp: new Date(),
        };

        const newMessages = [
            { role: userMessage.role, content: userMessage.content },
            { role: aiMessage.role, content: aiMessage.content },
        ];
        setMessages(prev => [...prev, userMessage, aiMessage]);
        console.log("update convo", title, newMessages);

        dispatch(addMessagesToConversation({ title, newMessages }))
            .unwrap()
            .then((data) => console.log("Conversation updated:", data))
            .catch((error) => console.error("Failed to updated conversation:", error));

        console.log("update convo 2 ", title, newMessages);
    }

    const handleSendMessage = () => {
        if (newChat)
            handleNewChatSend()
        handleNewChatExisting()
    }

    return (
        <main className="flex flex-col h-screen overflow-hidden">
            <ChatInterfaceHeader setTitle={setTitle} title={title} />
            <ScrollViewMessages messages={messages} loading={loading} />
            <InputArea image={image} input={input} setInput={setInput} handleKeyPress={handleKeyPress} fileInputRef={fileInputRef} handleFileChange={handleFileChange}
                handleSendMessage={handleSendMessage}
            />
        </main >
    );
}




// const handleNewChat = () => {
//     setMessages([])
//     const body = {}
//     createConversation()
// }



// const handleSend = async () => {
//     console.log("handleSend")
//     if (!input.trim()) return;
//     const userMessage = {
//         id: Date.now().toString(),
//         content: input || "[Image Uploaded]",
//         image,
//         role: 'user',
//         timestamp: new Date(),
//     };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);
//     setImage('');
//     try {
//         const res = await fetch('/api/generate', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ prompt: input, model: selectedModel }),
//         });

//         // console.log("res is", res)

//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error || 'Something went wrong');

//         const aiMessage = {
//             id: (Date.now() + 1).toString(),
//             content: data.result,
//             role: 'assistant',
//             timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//         const errorMessage = {
//             id: (Date.now() + 2).toString(),
//             content: `Error: ${error.message}`,
//             role: 'assistant',
//             timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, errorMessage]);
//     } finally {
//         setLoading(false);
//     }
// };


// const handleSend = async () => {
//     if (!input.trim() && !image) return;

//     setLoading(true);

//     const userMessage = {
//         id: Date.now().toString(),
//         content: input || "[Image Uploaded]",
//         image,
//         role: 'user',
//         timestamp: new Date(),
//     };

//     // Simulate AI reply
//     const aiMessage = {
//         id: (Date.now() + 1).toString(),
//         content: "Why did the AI cross the road? To optimize the other side!",
//         role: 'assistant',
//         timestamp: new Date(),
//     };

//     const newMessages = [
//         { role: userMessage.role, content: userMessage.content },
//         { role: aiMessage.role, content: aiMessage.content },
//     ];

//     // Update local UI immediately
//     setMessages((prev) => [...prev, userMessage, aiMessage]);
//     setInput('');
//     setImage('');

//     try {
//         if (newChat && title) {
//             // 1. New conversation
//             await dispatch(createConversation({ title, messages: newMessages })).unwrap();
//             console.log("✅ New conversation created");
//             setNewChat(false);
//         } else if (currConvo && selectedConversation) {
//             // 2. Existing conversation
//             await dispatch(addMessagesToConversation({ title: currConvo, messages: newMessages })).unwrap();
//             console.log("✏️ Conversation updated");
//         } else {
//             // 3. GPT-only
//             const res = await fetch('/api/generate', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt: input, model: selectedModel }),
//             });

//             const data = await res.json();
//             if (!res.ok) throw new Error(data.error || "Something went wrong");

//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     id: Date.now().toString(),
//                     content: data.result,
//                     role: "assistant",
//                     timestamp: new Date(),
//                 },
//             ]);

//             console.log("🤖 GPT response sent");
//         }
//     } catch (error) {
//         setMessages((prev) => [
//             ...prev,
//             {
//                 id: Date.now().toString(),
//                 content: `Error: ${error.message}`,
//                 role: "assistant",
//                 timestamp: new Date(),
//             },
//         ]);
//         console.error("❌ Error:", error);
//     } finally {
//         setLoading(false);
//     }
// };
