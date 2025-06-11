"use client";
import { Edit, ChevronRight, Trash2 } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Make sure you have an Input component
import { deleteConversation, editConversationTitle } from "@/app/store/slices/conversationSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export function NavMain({ items, onConversationSelect }) {
    // console.log("items", items)
    // console.log("items.items", items?.items)
    const dispatch = useDispatch();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const handleDeleteConversation = async (id) => {
        console.log("handleDeleteConversation", id)
        try {
            const data = await dispatch(deleteConversation(id)).unwrap();
            console.log("Deleted", data);
        } catch (error) {
            console.error("Delete Error", error);
        }
    };

    const handleEditClick = (id, title) => {
        console.log("handleEditClick", id, title)
        setSelectedId(id);
        setEditedTitle(title);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        console.log("handleSaveEdit")
        try {
            dispatch(editConversationTitle({ id: selectedId, newTitle: editedTitle }))
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Edit error", error);
        }
    };

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem
                                                key={subItem.id}
                                                className=" flex items-center justify-between"
                                            >
                                                <SidebarMenuSubButton
                                                    className=" w-full flex justify-between w-fit"
                                                    onClick={() => onConversationSelect?.(subItem.id)}
                                                >
                                                    <span className="text-xs">{subItem.title}</span>
                                                </SidebarMenuSubButton>
                                                <div className="flex justify-center items-center space-x-2">
                                                    <Edit
                                                        onClick={() =>
                                                            handleEditClick(subItem.id, subItem.title)
                                                        }
                                                        size={16}
                                                        className="cursor-pointer"
                                                    />
                                                    <Trash2
                                                        onClick={() =>
                                                            handleDeleteConversation(subItem.id)
                                                        }
                                                        size={16}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            {/* Edit Modal */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Conversation Title</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Enter new title"
                    />
                    <DialogFooter className="mt-4">
                        <Button variant="secondary" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// "use client";
// import { Edit, ChevronRight, Trash2 } from "lucide-react";
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     SidebarMenuSub,
//     SidebarMenuSubButton,
//     SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { deleteConversation, editConversationTitle } from "@/app/store/slices/conversationSlice";
// import { useDispatch } from "react-redux";
// import { useState } from "react";

// export function NavMain({ items, onConversationSelect }) {
//     const dispatch = useDispatch();

//     const handleDeleteConversation = async (title) => {
//         try {
//             const data = await dispatch(deleteConversation(title)).unwrap();
//             console.log("Deleted", data);
//         } catch (error) {
//             console.error("Delete Error", error);
//         }
//     };

//     return (
//         <>
//             <SidebarGroup>
//                 <SidebarGroupLabel>Platform</SidebarGroupLabel>
//                 <SidebarMenu>
//                     {items.map((item) => (
//                         <Collapsible
//                             key={item.title}
//                             asChild
//                             defaultOpen={item.isActive}
//                             className="group/collapsible"
//                         >
//                             <SidebarMenuItem>
//                                 <CollapsibleTrigger asChild>
//                                     <SidebarMenuButton tooltip={item.title}>
//                                         {item.icon && <item.icon />}
//                                         <span>{item.title}</span>
//                                         <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                                     </SidebarMenuButton>
//                                 </CollapsibleTrigger>
//                                 <CollapsibleContent>
//                                     <SidebarMenuSub>
//                                         {item.items?.map((subItem) => (
//                                             <SidebarMenuSubItem
//                                                 key={subItem.id}
//                                                 className="flex items-center justify-between"
//                                             >
//                                                 <SidebarMenuSubButton
//                                                     className="flex justify-between w-fit"
//                                                     onClick={() => {
//                                                         if (
//                                                             onConversationSelect &&
//                                                             item.title === "Conversations"
//                                                         ) {
//                                                             onConversationSelect(subItem.title);
//                                                         }
//                                                     }}
//                                                 >
//                                                     <span className="text-xs">{subItem.title}</span>
//                                                 </SidebarMenuSubButton>
//                                                 <div className="flex justify-center items-center space-x-2">
//                                                     <Edit onClick={console.log("edit")} size={16} />
//                                                     <Trash2 onClick={console.log("delete")} size={16} />
//                                                 </div>
//                                             </SidebarMenuSubItem>
//                                         ))}
//                                     </SidebarMenuSub>
//                                 </CollapsibleContent>
//                             </SidebarMenuItem>
//                         </Collapsible>
//                     ))}
//                 </SidebarMenu>
//             </SidebarGroup>

          
//         </>
//     );
// }

// // "use client"
// // import { Edit, ChevronRight, Trash2, Check, X } from 'lucide-react';
// // import {
// //     Collapsible,
// //     CollapsibleContent,
// //     CollapsibleTrigger,
// // } from "@/components/ui/collapsible"
// // import {
// //     SidebarGroup,
// //     SidebarGroupLabel,
// //     SidebarMenu,
// //     SidebarMenuButton,
// //     SidebarMenuItem,
// //     SidebarMenuSub,
// //     SidebarMenuSubButton,
// //     SidebarMenuSubItem,
// // } from "@/components/ui/sidebar"
// // import { deleteConversation, editConversationTitle } from '@/app/store/slices/conversationSlice';
// // import { useDispatch } from 'react-redux';
// // import { useState } from 'react';

// // export function NavMain({ items, onConversationSelect }) {

// //     console.log("Full items structure:", items); // To check the full structure of 'items'
// //     if (Array.isArray(items)) {
// //         console.log("Items in NavMain:", items.map(item => item)); // Logging each item
// //         console.log("Items in NavMain 2:", items.map(item => item.title)); // Accessing titles directly
// //     } else {
// //         console.log("items is not an array or it's undefined");
// //     }


// //     const [isEdit, setIsEdit] = useState(false); // Track if editing
// //     const [editedId, setEditedId] = useState(null); // Track the ID of the conversation being edited
// //     const [editedTitle, setEditedTitle] = useState(''); // Track the edited title
// //     const dispatch = useDispatch();

// //     // Handle editing the conversation title
// //     const handleEditConversationTitle = async (oldTitle, newTitle) => {
// //         try {
// //             const data = await dispatch(editConversationTitle({ oldTitle, newTitle })).unwrap();
// //             console.log("Title Edited", data);
// //         } catch (error) {
// //             console.error("Edit Error", error);
// //         }
// //     }

// //     // Handle deleting the conversation
// //     const handleDeleteConversation = async (title) => {
// //         try {
// //             const data = await dispatch(deleteConversation(title)).unwrap();
// //             console.log("Deleted", data);
// //         } catch (error) {
// //             console.error("Delete Error", error);
// //         }
// //     }

// //     // Toggle edit mode for specific conversation
// //     const toggleEdit = (subItem) => {
// //         setIsEdit(true);
// //         setEditedId(subItem.id); // Set the ID of the conversation being edited
// //         setEditedTitle(subItem.title); // Set the current title to the local state when editing starts
// //     }

// //     // Handle the title change
// //     const handleTitleChange = (e) => {
// //         setEditedTitle(e.target.value); // Update the title as the user types
// //     }

// //     // Save the edit
// //     const handleSaveEdit = () => {
// //         if (editedId) {
// //             handleEditConversationTitle(editedId, editedTitle); // Edit the conversation title based on ID
// //             setIsEdit(false); // Turn off editing mode
// //             setEditedId(null); // Clear the editing state
// //         }
// //     }

// //     // Cancel editing
// //     const handleCancelEdit = () => {
// //         setIsEdit(false);
// //         setEditedId(null);
// //         setEditedTitle('');
// //     }

// //     return (
// //         <SidebarGroup>
// //             <SidebarGroupLabel>Platform</SidebarGroupLabel>
// //             <SidebarMenu>
// //                 {items.map((item) => (
// //                     <Collapsible
// //                         key={item.title}
// //                         asChild
// //                         defaultOpen={item.isActive}
// //                         className="group/collapsible"
// //                     >
// //                         <SidebarMenuItem>
// //                             <CollapsibleTrigger asChild>
// //                                 <SidebarMenuButton tooltip={item.title}>
// //                                     {item.icon && <item.icon />}
// //                                     <span>{item.title}</span>
// //                                     <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
// //                                 </SidebarMenuButton>
// //                             </CollapsibleTrigger>
// //                             <CollapsibleContent>
// //                                 <SidebarMenuSub>
// //                                     {item.items?.map((subItem) => (
// //                                         <SidebarMenuSubItem key={subItem.id} className='flex items-center justify-between'>
// //                                             <SidebarMenuSubButton
// //                                                 className="flex justify-between w-fit"
// //                                                 onClick={() => {
// //                                                     if (onConversationSelect && item.title === 'Conversations') {
// //                                                         onConversationSelect(subItem.title);
// //                                                     }
// //                                                 }}>

// //                                                 {isEdit && editedId === subItem.id ? (
// //                                                     <input
// //                                                         value={editedTitle}
// //                                                         onChange={handleTitleChange}
// //                                                     />
// //                                                 ) : (
// //                                                     <span className='text-xs'>{subItem.title}</span>
// //                                                 )}
// //                                             </SidebarMenuSubButton>

// //                                             <div className='flex justify-center items-center space-x-2'>
// //                                                 {isEdit && editedId === subItem.id ? (
// //                                                     <>
// //                                                         <Check onClick={handleSaveEdit} size={16} />
// //                                                         <X onClick={handleCancelEdit} size={16} />
// //                                                     </>
// //                                                 ) : (
// //                                                     <>
// //                                                         <Edit onClick={() => toggleEdit(subItem)} size={16} />
// //                                                         <Trash2 onClick={() => handleDeleteConversation(subItem.title)} size={16} />
// //                                                     </>
// //                                                 )}
// //                                             </div>
// //                                         </SidebarMenuSubItem>
// //                                     ))}
// //                                 </SidebarMenuSub>
// //                             </CollapsibleContent>
// //                         </SidebarMenuItem>
// //                     </Collapsible>
// //                 ))}
// //             </SidebarMenu>
// //         </SidebarGroup >
// //     )
// // }

// // "use client"
// // import { Edit, ChevronRight, Trash2, Check, Cross, X } from 'lucide-react';
// // import {
// //     Collapsible,
// //     CollapsibleContent,
// //     CollapsibleTrigger,
// // } from "@/components/ui/collapsible"
// // import {
// //     SidebarGroup,
// //     SidebarGroupLabel,
// //     SidebarMenu,
// //     SidebarMenuButton,
// //     SidebarMenuItem,
// //     SidebarMenuSub,
// //     SidebarMenuSubButton,
// //     SidebarMenuSubItem,
// // } from "@/components/ui/sidebar"
// // import { deleteConversation, editConversationTitle } from '@/app/store/slices/conversationSlice';
// // import { useDispatch } from 'react-redux';
// // import { useState } from 'react';

// // export function NavMain({ items, onConversationSelect }) {
// //     const [isEdit, setIsEdit] = useState(false)
// //     const [editedTitle, setEditedTitle] = useState('');
// //     const dispatch = useDispatch();

// //     const handleEditConversationTitle = (title) => {
// //         dispatch(editConversationTitle(title))
// //             .unwrap()
// //             .then((data) => console.log("Deleted", data))
// //             .catch((error) => console.log("error", error))
// //     }
// //     const handleDeleteConversation = (title) => {
// //         dispatch(deleteConversation(title))
// //             .unwrap()
// //             .then((data) => console.log("Deleted", data))
// //             .catch((error) => console.log("error", error))
// //     }

// //     const handleIsEdit = () => {
// //         setIsEdit(!isEdit)
// //     }

// //     const handleTitleChange = (e) => {
// //         setEditedTitle(e.target.value);
// //     }

// //     const toggleEdit = (title) => {
// //         setIsEdit(prev => !prev);
// //         setEditedTitle(title); // Set the current title to the local state when editing starts
// //     }

// //     return (
// //         <SidebarGroup>
// //             <SidebarGroupLabel>Platform</SidebarGroupLabel>
// //             <SidebarMenu>
// //                 {items.map((item) => (
// //                     <Collapsible
// //                         key={item.title}
// //                         asChild
// //                         defaultOpen={item.isActive}
// //                         className="group/collapsible"
// //                     >
// //                         <SidebarMenuItem>
// //                             <CollapsibleTrigger asChild>
// //                                 <SidebarMenuButton tooltip={item.title}>
// //                                     {item.icon && <item.icon />}
// //                                     <span>{item.title}</span>
// //                                     <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
// //                                 </SidebarMenuButton>
// //                             </CollapsibleTrigger>
// //                             <CollapsibleContent>
// //                                 <SidebarMenuSub>
// //                                     {item.items?.map((subItem) => (
// //                                         <SidebarMenuSubItem key={subItem.title} className='flex items-center justify-between'>
// //                                             <SidebarMenuSubButton
// //                                                 className="flex justify-between w-fit"
// //                                                 onClick={() => {
// //                                                     if (onConversationSelect && item.title === 'Conversations') {
// //                                                         onConversationSelect(subItem.title);
// //                                                     }
// //                                                 }}>


// //                                                 {isEdit ?
// //                                                     <input
// //                                                         value={editedTitle}
// //                                                         onChange={handleTitleChange}
// //                                                     />
// //                                                     :
// //                                                     <span className='text-xs'>{subItem.title}</span>
// //                                                 }
// //                                             </SidebarMenuSubButton>


// //                                             {isEdit ? (
// //                                                 <div className='flex justify-center items-center space-x-2'>
// //                                                     <Check onClick={() => handleEditConversationTitle(subItem.title)} size={16} />
// //                                                     <X onClick={() => setIsEdit(false)} size={16} />
// //                                                 </div>


// //                                             ) : (
// //                                                 <div className='flex justify-center items-center space-x-2'>
// //                                                     <Edit
// //                                                         onClick={() => toggleEdit(subItem.title)}
// //                                                         size={16}

// //                                                     />
// //                                                     <Trash2
// //                                                         onClick={() => handleDeleteConversation(subItem.title)}
// //                                                         size={16}
// //                                                     />
// //                                                 </div>

// //                                             )}

// //                                         </SidebarMenuSubItem>
// //                                     ))}
// //                                 </SidebarMenuSub>

// //                             </CollapsibleContent>
// //                         </SidebarMenuItem>
// //                     </Collapsible>
// //                 ))}
// //             </SidebarMenu>
// //         </SidebarGroup >
// //     )
// // }
