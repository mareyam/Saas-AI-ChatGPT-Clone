'use client'
import { useEffect, useRef, useState } from "react";
import { useModels } from "@/hooks/useModels";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversationByTitle, createConversation, addMessagesToConversation, fetchConversationById } from "@/app/store/slices/conversationSlice";
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
    const [selectedId, setSelectedId] = useState("")
    const [newChat, setNewChat] = useState(false)
    const dispatch = useDispatch();
    const currConvo = useSelector((state) => state.conversation.currConvo);
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);

    useEffect(() => {
        if (selectedConversation?.messages?.length) {
            const isSame = JSON.stringify(messages) === JSON.stringify(selectedConversation.messages);
            if (!isSame) {
                setMessages(selectedConversation.messages);
                setSelectedId(selectedConversation.id);
            }
        } else {
            setMessages([]);
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
        if (currConvo && currConvo !== selectedConversation?.id) {
            console.log("inside useEffect - fetching by currConvo");
            dispatch(fetchConversationById(currConvo));
        }
    }, [currConvo, selectedConversation?.id, dispatch]);


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

    const handleNewChatExisting = async () => {
        console.log(title + selectedId + "existing chat")

        const userMessage = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage])

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    model: selectedModel,
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

            setMessages(prev => [...prev, aiMessage])
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
        dispatch(addMessagesToConversation({ id: selectedId, title, messages: messages }))
            .unwrap()
            .then((data) => console.log("Conversation updated:", data))
            .catch((error) => console.error("Failed to updated conversation:", error));

        console.log("update convo 2 ", title, messages);
    }

    const handleSendMessage = () => {
        const isFirstMessage = messages.length === 0 || newChat;

        if (isFirstMessage) {
            console.log("handleNewChatSend")
            handleNewChatSend();
        } else {
            console.log("handleNewChatExisting")
            handleNewChatExisting();
        }
    };


    return (
        <main className="border-2 border-red-500 flex flex-col h-screen overflow-hidden">
            <ChatInterfaceHeader setTitle={setTitle} title={title} />
            <ScrollViewMessages messages={messages} loading={loading} />
            <InputArea image={image} input={input} setInput={setInput} handleKeyPress={handleKeyPress} fileInputRef={fileInputRef} handleFileChange={handleFileChange}
                handleSendMessage={handleSendMessage}
            />
        </main >
    );
}

