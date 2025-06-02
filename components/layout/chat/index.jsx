import { AppSidebar } from "@/components/layout/chat/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChatInterface } from "./chat-interface"


const Chat = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className='border-2 border-orange-500 h-screen overflow-y-hidden' >
                <ChatInterface />
            </SidebarInset>
        </SidebarProvider>
    );
}
export default Chat;