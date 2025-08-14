import { useState, useEffect } from 'react';
import {renameFile, getThumbnailUrl, getImageBlobUrl, deleteFile, getVideoHlsStreamUrl} from "../../../common/ApiService";
import FileRenameDialogue from "./Dialogues/FileRenameDialogue";
import OptionsMenu from "./OptionsMenu";
import HlsPlayer from "./HlsPlayer";
import {ChatBubbleBottomCenterTextIcon} from "@heroicons/react/24/solid";
import {FileCommentView} from "./FileCommentView";

export default function FileItem({ file = {}, showOptions, onDelete }) {
    const [fileUrl, setFileUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);

    const [isRenaming, setIsRenaming] = useState(false);
    const [showingComments, setShowingComments] = useState(false);

    const handleRename = async function(newName) {
        const result = await renameFile(file.id, newName);

        setIsRenaming(false);

        if (!result.success) {
            alert(result.error);
            return;
        }

        file.name = newName;
    };

    useEffect(() => {
        const loadThumbnailUrl = async () => {
            const result = await getThumbnailUrl(file.id);

            if (!result.success) {
                alert(result.error);
                return;
            }

            setThumbnailUrl(result.url);
        };

        loadThumbnailUrl();
    }, [file.id]);

    const handleCardClick = async (e) => {
        e.preventDefault();

        let result;

        if (file.fileType.category === "VIDEO") {
            result = await getVideoHlsStreamUrl(file.id);
        }
        else if (file.fileType.category === "IMAGE") {
            result = await getImageBlobUrl(file.id);
        }
        else {
            return;
        }

        if (!result.success) {
            alert(result.error);
            return;
        }

        setFileUrl(result.url);
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();

        setShowingComments(true);
    }

    const handleDelete = async (e) => {
        e.stopPropagation();

        const result = await deleteFile(file.id);

        if (!result.success) {
            alert(result.error);
            return;
        }

        if (onDelete !== undefined) {
            onDelete(file.id);
        }
    };

    return(
        <>
            {fileUrl && (
                <div className=" fixed inset-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        {file.fileType.category === "IMAGE" && <img src={fileUrl} alt="Preview" className="max-w-[90vw] max-h-[80vh]"/>}
                        {file.fileType.category === "VIDEO" && <HlsPlayer videoUrl={fileUrl}/>}
                        <button onClick={() => setFileUrl(null)} className="mt-4 text-red-600">Close</button>
                    </div>
                </div>
            )}
            <div className="w-[330px] h-[225px] bg-[#ffffff] cursor-pointer rounded-3xl border-2 border-gray-200 flex flex-col items-center transition-transform duration-200 hover:scale-110 relative" onClick={handleCardClick}>
                <div className="w-[270px] h-[60px] bg-[#ffffff] rounded-3xl flex flex-row items-center justify-between">
                    <h3 className="text-[#323232] text-[19px]">{file.name || "Unnamed file"}</h3>

                    {showOptions && <OptionsMenu handleDelete={handleDelete} setIsRenaming={setIsRenaming}/>}
                </div>
                <div className="relative bg-[#CFEFD4] w-[270px] h-[135px] rounded-3xl overflow-hidden">
                    {thumbnailUrl ? (<img src={thumbnailUrl} alt="File preview" className="w-full h-full object-cover"/>) :
                        (<span className="text-sm text-gray-600">No preview</span>)}
                </div>
                <button onClick={handleCommentClick} className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm shadow">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>
                </button>
            </div>
            {isRenaming && <FileRenameDialogue name={file.name} handleRename={handleRename} setIsRenaming={setIsRenaming} />}
            {showingComments && <FileCommentView file={file} onClose={() => setShowingComments(false)}/>}
        </>
    );
}