import {ArrowUpTrayIcon, FolderPlusIcon} from "@heroicons/react/24/solid";

import FileItem from "./FileComponents/FileItem.jsx";
import MediaUploadDialogue from "./FileComponents/Dialogues/MediaUploadDialogue.jsx";
import {useState, useEffect} from "react";
import {getFiles} from "../../common/ApiService";
import FolderItem from "./FileComponents/FolderItem";
import FolderCloseItem from "./FileComponents/FolderCloseItem";
import CreateFolderDialogue from "./FileComponents/Dialogues/CreateFolderDialogue";

export default function Gallery() {
    const [showUpload, setShowUpload] = useState(false);
    const [createFolder, setCreateFolder] = useState(false);

    const [folderStack, setFolderStack] = useState( [])
    const [files, setFiles] = useState([]);

    const pushFolder = (item) => {
        setFolderStack(prevStack => [...prevStack, item]);
    };

    const popFolder = () => {
        setFolderStack(prevStack => {
            if (prevStack.length === 0) {
                return prevStack;
            }

            return prevStack.slice(0, prevStack.length - 1);
        });
    };

    const handleUploadSuccess = (newFile) => {
        setFiles((prev) => [...prev, newFile]);
        setShowUpload(false);
    };

    const handleCreateFolderSuccess = (newFolder) => {
        setFiles((prev) => [...prev, newFolder]);

        setCreateFolder(false);
    }

    const handleDeleteFromParent = (id) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    };

    const handleOpenFolder = (id) => {
        pushFolder(id);
    }

    const handleCloseFolder = () => {
        popFolder();
    }

    useEffect(() => {
        const fetchFiles = async (parent) => {
            const result = await getFiles(parent);

            if (!result.success) {
                alert(result.error);
            }
            else {
                setFiles(result.files);
            }
        };

        fetchFiles(folderStack[folderStack.length - 1] || null);
    }, [folderStack]);

    return (
        <div className="flex-1 flex flex-col h-screen bg-[#F1FFFB] p-20">
            <div className="w-full h-40 flex justify-between">
                <div className="">
                    <h2 className="text-[34px] font-bold text-[#444444]">Gallery</h2>
                    <p className=" text-[#555555]">Upload your Content</p>
                </div>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setCreateFolder(true)}
                            className="flex h-12 w-12 bg-[#07797a] shadow-[0_6px_9px_-2px_rgba(0,0,0,0.6)] rounded-full justify-center items-center font-bold text-[#f1fffb] text-[30px] transition-transform duration-200 hover:scale-110">
                        <FolderPlusIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={() => setShowUpload(true)}
                            className="flex h-12 w-12 bg-[#07797a] shadow-[0_6px_9px_-2px_rgba(0,0,0,0.6)] rounded-full justify-center items-center font-bold text-[#f1fffb] text-[30px] transition-transform duration-200 hover:scale-110">
                        <ArrowUpTrayIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-6 mt-6 px-4 py-4">
                {folderStack.length > 0 && (
                    <FolderCloseItem key={folderStack[folderStack.length - 1]} onCloseFolder={handleCloseFolder}/>
                )}

                {files.map((file) => (
                    file.fileType.category === "FOLDER"
                        ? <FolderItem key={file.id} file={file} showOptions={true} onOpen={handleOpenFolder} onDelete={handleDeleteFromParent}/>
                        : <FileItem key={file.id} file={file} showOptions={true} onDelete={handleDeleteFromParent}/>
                ))}
            </div>
            {showUpload && (
                <MediaUploadDialogue folder={folderStack.length > 0 ? folderStack[folderStack.length - 1] : null} onClose={() => setShowUpload(false)} onUploadSuccess={handleUploadSuccess}/>
            )}
            {createFolder && (
                <CreateFolderDialogue folder={folderStack.length > 0 ? folderStack[folderStack.length - 1] : null} onClose={() => setCreateFolder(false)} onSuccess={handleCreateFolderSuccess}/>
            )}
        </div>
    );
}