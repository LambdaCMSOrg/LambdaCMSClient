import {isUserId, updateComment} from "../../../common/ApiService";
import {useEffect, useRef, useState} from "react";
import {EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import CommentEditDialogue from "./Dialogues/CommentEditDialogue";

export function FileComment({ comment, index, onDelete }) {
    const dropdownRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const isUser = isUserId(comment.authorId);

    const timestamp = new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const fromUser = isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800";

    const handleMenuClick = e => {
        setMenuOpen(!menuOpen);

        e.stopPropagation();
    };

    const handleEditStart = e => {
        setMenuOpen(false);

        setIsEditing(true);

        e.stopPropagation();
    }

    const handleEditSuccess = async (newComment) => {
        await updateComment(comment.commentId, newComment);

        setIsEditing(false);

        comment.comment = newComment;
    }

    const handleDelete = () => {
        setMenuOpen(false);

        onDelete(comment);
    }

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <>
            <div key={index} className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`inline-block ${fromUser} px-4 py-2 max-w-[70%] rounded-lg break-words relative`}>
                    <div className="flex justify-between items-start">
                        <div className="text-xs font-semibold text-gray-700 mb-1">{comment.authorName}</div>

                        {isUser && (
                            <div className="relative ml-2">
                                <button onClick={handleMenuClick} className="text-gray-800 hover:text-gray-700 text-sm">
                                    <EllipsisHorizontalIcon className="w-4 h-4"/>
                                </button>

                                {menuOpen && (
                                    <div ref={dropdownRef} className="absolute right-0 mt-1 w-24 bg-gray-50 border rounded shadow-lg z-10">
                                        <button onClick={handleEditStart} className="block w-full text-left px-2 py-1 text-sm text-gray-800 hover:bg-gray-200">Edit</button>
                                        <button onClick={handleDelete} className="block w-full text-left px-2 py-1 text-sm text-gray-800 hover:bg-gray-200">Delete</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>{comment.comment}</div>
                    <div className="text-[10px] text-gray-800 text-right mt-1">{timestamp}</div>
                </div>
            </div>
            {isEditing && (<CommentEditDialogue comment={comment.comment} handleEdit={handleEditSuccess} setIsEditing={setIsEditing} />)}
        </>
    );
}