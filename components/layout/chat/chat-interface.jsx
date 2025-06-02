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
import { useFileBase64 } from "@/hooks/useFileBase64";
import CustomGPT from "./custom-gpt";
import { useConversations } from "@/hooks/useConversations";



import { useSelector, useDispatch } from 'react-redux'
import {
    fetchConversationByTitle,
    setCurrConvo,
} from '@/app/store/slices/conversationSlice'


export function ChatInterface() {

    const { selectedModel } = useModels();
    // const { conversations, fetchConversationByTitle, currConvo, selectedConversation } = useConversations();
    const { conversations, fetchConversationByTitle } = useConversations();

    const { imageBase64, setImageBase64, handleFileBase64 } = useFileBase64();
    const [openCustomGPTModal, setOpenCustomGPTModal] = useState(false);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState('');
    const [input, setInput] = useState('');
    // const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const { currConvo, selectedConversation, loading } = useSelector(
        (state) => state.conversation
    )
    const [messages, setMessages] = useState([])

    // When selected conversation changes, update local messages state
    useEffect(() => {
        if (selectedConversation?.messages?.length) {
            setMessages(selectedConversation.messages)
        } else {
            setMessages([])
        }
    }, [selectedConversation])

    // When currConvo changes, fetch full conversation
    useEffect(() => {
        if (currConvo) {
            dispatch(fetchConversationByTitle(currConvo))
        }
    }, [currConvo, dispatch])

    // const [messages, setMessages] = useState(selectedConversation);


    useEffect(() => {
        console.log("currConvo in chat-interface", currConvo)

        if (currConvo) {
            fetchConversationByTitle(currConvo);
        }
    }, [currConvo]);

    useEffect(() => {
        console.log("messages in chat-interface")

        if (selectedConversation?.messages?.length) {
            setMessages(selectedConversation.messages);
            console.log(messages)
        }
    }, [selectedConversation]);


    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl)
        // console.log("Selected image URL:", imageUrl);
    };


    const handleSend = async () => {
        console.log("handleSend")
        if (!input.trim()) return;
        const userMessage = {
            id: Date.now().toString(),
            content: input || "[Image Uploaded]",
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
                body: JSON.stringify({ prompt: input, model: selectedModel }),
            });

            // console.log("res is", res)

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
            if (!loading) handleSend();
        }
    };





    // This handler should be called from sidebar (not shown here)
    // Example:
    // dispatch(setCurrConvo(selectedTitle))

    return (
        <main className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-2 border-2 border-red-500">
                    <SidebarTrigger>
                        <Menu className="h-5 w-5" />
                    </SidebarTrigger>

                    <h1 className="text-lg font-semibold">ChatGPT Clone</h1>
                </div>
                <div>
                    <Button variant="outline" onClick={() => setOpenCustomGPTModal(true)}>
                        Open
                    </Button>



                    <ChatGPTModelSelection />
                </div>
            </div>

            {/* Chat Messages */}
            {/* <ScrollArea className="flex-1 p-4 h-[75dvh]">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages?.map((message) => (
                        <ChatMessage key={message.id} message={message} image={image} />
                    ))}
                    {loading && (
                        <p className="text-center text-sm text-muted-foreground">AI is typing...</p>
                    )}
                </div>
            </ScrollArea> */}

            <ScrollArea className="flex-1 p-4 h-[75dvh]">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.length === 0 && !loading && (
                        <p className="text-center text-muted-foreground">No messages yet</p>
                    )}
                    {messages.map((message, idx) => (
                        <ChatMessage key={idx} message={message} />
                    ))}
                    {loading && (
                        <p className="text-center text-sm text-muted-foreground">AI is typing...</p>
                    )}
                </div>
            </ScrollArea>



            {/* Input Area */}
            <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

                {image && (
                    <div className="max-w-3xl mx-auto p-4 ">
                        <Image
                            src={image}
                            width={200}
                            height={200}
                            alt="Uploaded preview"
                            className="rounded-md border-1 border-black"
                        />
                    </div>
                )}


                <div className="max-w-3xl mx-auto p-4 border-2">
                    <div className="relative flex items-end gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="min-h-[60px] max-h-[200px] resize-none pr-12 rounded-2xl border-border/40 focus:border-primary/40 transition-colors"
                            rows={1}
                            disabled={loading}
                        />

                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            size="icon"
                            className="absolute right-12 bottom-2 h-8 w-8 rounded-full"
                            disabled={loading}
                        >
                            <ImagePlus className="h-4 w-4" />
                        </Button>

                        {/* Hidden File Input */}
                        <input
                            id="picture"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />


                        <Button
                            onClick={image ? handleImageSend : handleSend}
                            disabled={(!input.trim() && !image) || loading}
                            size="icon"
                            className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
                        >
                            <Send className="h-4 w-4" />
                        </Button>

                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        This is a demo interface. Messages are sent to a real AI service.
                    </p>
                </div>
            </div>

            {openCustomGPTModal && (
                <CustomGPT
                    open={openCustomGPTModal}
                    onClose={() => setOpenCustomGPTModal(false)}
                />
            )}

        </main >
    );
}


// const handleImageSend = async () => {
//     console.log("handleImageSend")
//     if (!image.trim()) return;
//     setImageBase64(image)

//     const userMessage = {
//         id: Date.now().toString(),
//         content: input || '[Image uploaded]',
//         image: imageBase64,
//         role: 'user',
//         timestamp: new Date(),
//     };

//     console.log(userMessage)
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);
//     setImage('');
//     try {
//         const res = await fetch('/api/generate', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 prompt: `Image URL: ${imageBase64}\nUser says: ${input || 'No additional text'}`,
//                 model: selectedModel,
//             }),
//         });

//         const data = await res.json();

//         console.log("data", data)


//         if (!res.ok) throw new Error(data.error || 'Something went wrong');

//         const aiMessage = {
//             id: (Date.now() + 1).toString(),
//             content: data.result,
//             role: 'assistant',
//             timestamp: new Date(),
//         };

//         console.log("aiMessage", aiMessage)

//         setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//         const errorMessage = {
//             id: (Date.now() + 2).toString(),
//             content: `Error: ${error.message}`,
//             role: 'assistant',
//             timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, errorMessage]);
//         console.log("error", error)

//     } finally {
//         setLoading(false);
//         console.log("finally")
//     }
// };