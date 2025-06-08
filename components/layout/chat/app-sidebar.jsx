"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

import { useSelector, useDispatch } from "react-redux"
import {
    fetchConversations,
    fetchConversationByTitle,
    setCurrConvo,
} from "@/app/store/slices/conversationSlice"

export function AppSidebar(props) {
    const dispatch = useDispatch()
    const { conversations, currConvo } = useSelector((state) => state.conversation)

    React.useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

    // Map conversations to nav items
    const conversationItems = conversations?.map((item) => ({
        title: item.title,
        url: "#",
    }))

    const navMain = [
        {
            title: "Conversations",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: conversationItems || [],
        },
        // {
        //     title: "Playground",
        //     url: "#",
        //     icon: SquareTerminal,
        //     isActive: true,
        //     items: [
        //         { title: "History", url: "#" },
        //         { title: "Starred", url: "#" },
        //         { title: "Settings", url: "#" },
        //     ],
        // },
        // {
        //     title: "Models",
        //     url: "#",
        //     icon: Bot,
        //     items: [
        //         { title: "Genesis", url: "#" },
        //         { title: "Explorer", url: "#" },
        //         { title: "Quantum", url: "#" },
        //     ],
        // },
        // {
        //     title: "Documentation",
        //     url: "#",
        //     icon: BookOpen,
        //     items: [
        //         { title: "Introduction", url: "#" },
        //         { title: "Get Started", url: "#" },
        //         { title: "Tutorials", url: "#" },
        //         { title: "Changelog", url: "#" },
        //     ],
        // },
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: Settings2,
        //     items: [
        //         { title: "General", url: "#" },
        //         { title: "Team", url: "#" },
        //         { title: "Billing", url: "#" },
        //         { title: "Limits", url: "#" },
        //     ],
        // },
    ]


    const projects = [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ]

    const user = {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    }

    const teams = [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ]
    // Handler for selecting a conversation
    const handleSelectConversation = (title) => {
        dispatch(setCurrConvo(title))
        dispatch(fetchConversationByTitle(title))
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} onConversationSelect={handleSelectConversation} />
                <NavProjects projects={projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

// "use client"

// import * as React from "react"
// import {
//     AudioWaveform,
//     BookOpen,
//     Bot,
//     Command,
//     Frame,
//     GalleryVerticalEnd,
//     Map,
//     PieChart,
//     Settings2,
//     SquareTerminal,
// } from "lucide-react"

// import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
// import { NavUser } from "./nav-user"
// import { TeamSwitcher } from "./team-switcher"
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarHeader,
//     SidebarRail,
// } from "@/components/ui/sidebar"
// import { useConversations } from "@/hooks/useConversations"

// export function AppSidebar(props) {
//     const { conversations, setCurrConvo, currConvo } = useConversations()

//     const conversationItems = conversations?.map((item) => ({
//         title: item.title,
//         url: "#",
//     }))
//     console.log("currConvo in app-sidebar", currConvo)
//     const navMain = [
//         {
//             title: "Conversations",
//             url: "#",
//             icon: SquareTerminal,
//             isActive: true,
//             items: conversationItems || [],
//         },
//         {
//             title: "Playground",
//             url: "#",
//             icon: SquareTerminal,
//             isActive: true,
//             items: [
//                 { title: "History", url: "#" },
//                 { title: "Starred", url: "#" },
//                 { title: "Settings", url: "#" },
//             ],
//         },
//         {
//             title: "Models",
//             url: "#",
//             icon: Bot,
//             items: [
//                 { title: "Genesis", url: "#" },
//                 { title: "Explorer", url: "#" },
//                 { title: "Quantum", url: "#" },
//             ],
//         },
//         {
//             title: "Documentation",
//             url: "#",
//             icon: BookOpen,
//             items: [
//                 { title: "Introduction", url: "#" },
//                 { title: "Get Started", url: "#" },
//                 { title: "Tutorials", url: "#" },
//                 { title: "Changelog", url: "#" },
//             ],
//         },
//         {
//             title: "Settings",
//             url: "#",
//             icon: Settings2,
//             items: [
//                 { title: "General", url: "#" },
//                 { title: "Team", url: "#" },
//                 { title: "Billing", url: "#" },
//                 { title: "Limits", url: "#" },
//             ],
//         },
//     ]

//     const projects = [
//         {
//             name: "Design Engineering",
//             url: "#",
//             icon: Frame,
//         },
//         {
//             name: "Sales & Marketing",
//             url: "#",
//             icon: PieChart,
//         },
//         {
//             name: "Travel",
//             url: "#",
//             icon: Map,
//         },
//     ]

//     const user = {
//         name: "shadcn",
//         email: "m@example.com",
//         avatar: "/avatars/shadcn.jpg",
//     }

//     const teams = [
//         {
//             name: "Acme Inc",
//             logo: GalleryVerticalEnd,
//             plan: "Enterprise",
//         },
//         {
//             name: "Acme Corp.",
//             logo: AudioWaveform,
//             plan: "Startup",
//         },
//         {
//             name: "Evil Corp.",
//             logo: Command,
//             plan: "Free",
//         },
//     ]

//     return (
//         <Sidebar collapsible="icon" {...props}>
//             <SidebarHeader>
//                 <TeamSwitcher teams={teams} />
//             </SidebarHeader>
//             <SidebarContent>
//                 <NavMain items={navMain} setCurrConvo={setCurrConvo} />
//                 <NavProjects projects={projects} />
//             </SidebarContent>
//             <SidebarFooter>
//                 <NavUser user={user} />
//             </SidebarFooter>
//             <SidebarRail />
//         </Sidebar>
//     )
// }
