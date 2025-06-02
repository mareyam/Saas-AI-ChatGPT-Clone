'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image";

const ImageModal = ({ image, onClose }) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Image Preview</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                    <Image
                        src={image}
                        alt="Uploaded Preview"
                        width={800}
                        height={600}
                        className="rounded-md"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"

// const ImageModal = ({ image, onClose }) => {

//     return (
//         <Dialog>
//             <DialogTrigger>Open</DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Are you absolutely sure?</DialogTitle>
//                     <DialogDescription>
//                         This action cannot be undone. This will permanently delete your account
//                         and remove your data from our servers.
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>

//     )
// }

// export default ImageModal;

