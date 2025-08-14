import { FolderIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import {renameFile, deleteFile} from "../../../common/ApiService";
import FileRenameDialogue from "./Dialogues/FileRenameDialogue";
import OptionsMenu from "./OptionsMenu";

export default function FolderItem({ file = {}, showOptions, onOpen, onDelete }) {
    const [isRenaming, setIsRenaming] = useState(false);

    const handleRename = async function(newName) {
        const result = await renameFile(file.id, newName);

        setIsRenaming(false);

        if (!result.success) {
            alert(result.error);
            return;
        }

        file.name = newName;
    };

    const handleClick = async (e) => {
        e.preventDefault();

        onOpen(file.id);
    };

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
            <div className="w-[330px] h-[225px] bg-[#ffffff] cursor-pointer rounded-3xl border-2 border-gray-200 flex flex-col items-center transition-transform duration-200 hover:scale-110"
                 onClick={handleClick}>
                <div className=" relative w-[270px] h-[60px] bg-[#ffffff] rounded-3xl flex flex-row items-center justify-between">
                    <h3 className="text-[#323232] text-[19px]">{file.name || "Unnamed file"}</h3>

                    {showOptions && <OptionsMenu handleDelete={handleDelete} setIsRenaming={setIsRenaming}/>}
                </div>
                <div className="bg-[#CFEFD4] w-[270px] h-[135px] rounded-3xl relative overflow-hidden">
                    <FolderIcon className="absolute top-0 left-0 w-full h-full text-[#61FC86B3] object-cover"/>
                </div>
            </div>
            {isRenaming && <FileRenameDialogue name={file.name} handleRename={handleRename} setIsRenaming={setIsRenaming} />}
        </>
    );
}