import { useState, useEffect } from 'react';
import {renameImage, getThumbnailUrl, getImageBlobUrl, deleteImage} from "../../common/ApiService";
import FileRenameDialogue from "./FileRenameDialogue";
import OptionsMenu from "./OptionsMenu";

export default function FileItem({ file = {}, onDelete }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);

    const handleRename = async function(newName) {
        const result = await renameImage(file.id, newName);

        setIsRenaming(false);

        console.log("Rename result: ", result);

        if (!result.success) {
            alert(result.error);
            return;
        }

        window.location.reload();
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


    const handleClick = async (e) => {
        e.preventDefault();

        const result = await getImageBlobUrl(file.id);

        if (!result.success) {
            alert(result.error);
            return;
        }

        setPreviewUrl(result.url);
    };
        const handleDelete = async (e) => {
        e.stopPropagation();

        const result = await deleteImage(file.id);

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
            {previewUrl && (
                <div className=" fixed inset-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <img src={previewUrl} alt="Preview" className="max-w-[90vw] max-h-[80vh]" />
                        <button onClick={() => setPreviewUrl(null)} className="mt-4 text-red-600">Close</button>
                    </div>
                </div>
            )}
            <div className="w-[330px] h-[225px] bg-[#ffffff] cursor-pointer rounded-3xl border-2 border-gray-200 flex flex-col items-center transition-transform duration-200 hover:scale-110"
                 onClick={handleClick}>
                <div className=" relative w-[270px] h-[60px] bg-[#ffffff] rounded-3xl flex flex-row items-center justify-between">
                    <h3 className="text-[#323232] text-[19px]">{file.name || "Unnamed file"}</h3>

                    <OptionsMenu showOptions={showOptions} setShowOptions={setShowOptions} handleDelete={handleDelete} setIsRenaming={setIsRenaming} />
                </div>
                <div className="bg-[#CFEFD4] w-[270px] h-[135px] rounded-3xl ">
                    {thumbnailUrl ? (<img src={thumbnailUrl} alt="File preview" className="w-full h-full object-cover"/>) :
                        (<span className="text-sm text-gray-600">No preview</span>)}
                </div>
            </div>
            {isRenaming && <FileRenameDialogue name={file.name} handleRename={handleRename} setIsRenaming={setIsRenaming} />}
        </>
    );
}