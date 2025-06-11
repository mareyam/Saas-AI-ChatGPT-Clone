'use client'

import { useState } from "react";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ImageModal from "./image-modal";

export function ChatMessage({ message }) {
    const [openImageModal, setOpenImageModal] = useState(false);
    // console.log("message is", message)
    const isUser = message.role === 'user';

    return (
        <>
            <div className={cn("flex gap-4 group", isUser && "flex-row-reverse")}>
                <Avatar className={cn("h-8 w-8 shrink-0", isUser ? "bg-primary" : "bg-muted")}>
                    <AvatarFallback className={cn(isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                </Avatar>

                <div className={cn("flex-1 space-y-2 max-w-[80%]", isUser && "flex flex-col items-end")}>
                    <Card className={cn(
                        "p-4 shadow-sm border-border/40",
                        isUser
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted/50"
                    )}>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed block">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="User provided content"
                                    className="max-w-32 h-auto mb-2 rounded-md cursor-pointer"
                                    onClick={() => setOpenImageModal(true)}
                                />
                            )}
                            {message.content}
                        </div>
                    </Card>

                    <time className="text-xs text-muted-foreground px-1">
                        {/* {message?.timestamp?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })} */}
                    </time>
                </div>
            </div>

            {openImageModal && (
                <ImageModal
                    image={message.image}
                    onClose={() => setOpenImageModal(false)}
                />
            )}
        </>
    );
}

// import { Bot, User } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// export function ChatMessage({ message }) {
//     const [openImageModal, setOpenImageModal] = useState(false);
//     const isUser = message.role === 'user';

//     return (
//         <div className={cn(
//             "flex gap-4 group",
//             isUser && "flex-row-reverse"
//         )}>
//             <Avatar className={cn(
//                 "h-8 w-8 shrink-0",
//                 isUser ? "bg-primary" : "bg-muted"
//             )}>
//                 <AvatarFallback className={cn(
//                     isUser ? "bg-primary text-primary-foreground" : "bg-muted"
//                 )}>
//                     {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//                 </AvatarFallback>
//             </Avatar>

//             <div className={cn(
//                 "flex-1 space-y-2 max-w-[80%]",
//                 isUser && "flex flex-col items-end"
//             )}>
//                 <Card className={cn(
//                     "p-4 shadow-sm border-border/40",
//                     isUser
//                         ? "bg-primary text-primary-foreground ml-auto"
//                         : "bg-muted/50"
//                 )}>
//                     <p className="text-sm whitespace-pre-wrap leading-relaxed block">
//                         {message.image && (
//                             <img
//                                 src={message.image}
//                                 alt="User provided content"
//                                 className="max-w-32 h-auto mb-2 rounded-md"
//                                 onClick={() => setOpenImageModal(true)}
//                             />
//                         )}
//                         {message.content}
//                     </p>
//                 </Card>

//                 <time className="text-xs text-muted-foreground px-1">
//                     {message.timestamp.toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                     })}
//                 </time>
//             </div>
//         </div>
//     );

//     {
//         openImageModal && (
//             <ImageModal
//                 image={message.image}
//                 onClose={() => setOpenImageModal(false)}
//             />
//         )
//     }
// }