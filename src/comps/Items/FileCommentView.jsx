import {useEffect, useRef, useState} from "react";
import {getComments, postComment, deleteComment} from "../../common/ApiService";
import {FileComment} from "./FileComment";

export function FileCommentView({file, onClose}) {
    const scrollRef = useRef(null);

    const [comments, setComments] = useState([]);

    const [message, setMessage] = useState("");
    const [validMessage, setValidMessage] = useState(false);

    const handleSendComment = async () => {
        if (validMessage) {
            const result = await postComment(file.id, message);

            if (!result.success) {
                alert(result.error);
                return;
            }

            setMessage("");

            setComments(prevComments => [...prevComments, result.comment]);
        }
    }

    const handleCommentDelete = async (comment) => {
        await deleteComment(comment.commentId);

        setComments(prevComments => prevComments.filter(c => c.commentId !== comment.commentId));
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {
        setValidMessage(!(message == null || message.trim() === ''));
    }, [message]);

    useEffect(() => {
        const fetchComments = async (fileId) => {
            const result = await getComments(fileId);

            if (!result.success) {
                alert(result.error);
            }
            else {
                setComments(result.comments);
            }
        };

        fetchComments(file.id);
    }, [file]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments]);

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] h-[600px] flex flex-col rounded-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{file.name}</h3>
                    <button onClick={onClose} className="text-red-600 font-medium">Close</button>
                </div>

                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-2">
                    {comments.map((comment, index) =>
                        <FileComment comment={comment} key={index} onDelete={handleCommentDelete}/>)}
                </div>

                <div className="flex items-center p-4 border-t gap-2">
                    <input type="text" placeholder="Message" value={message} onChange={handleMessageChange} className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    <button onClick={handleSendComment} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}