import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import {renameImage, getThumbnailUrl, getImageBlobUrl, deleteImage} from "../common/Api";

function Files({ file = {}, onDelete }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showOption, setShowOptions] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(file.name || "");

    const handleOptionClick = (e) => {
        e.stopPropagation();
        setShowOptions(prev => !prev);
    };

    const handleRename = async () => {
        const result = await renameImage(file.id, newName);

        setIsRenaming(false);

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
    console.log("file object:", file);

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
                        <img src={previewUrl} alt="Vorschau" className="max-w-[90vw] max-h-[80vh]" />
                        <button onClick={() => setPreviewUrl(null)} className="mt-4 text-red-600">Schließen</button>
                    </div>
                </div>
            )}
            <div className="w-[330px] h-[225px] bg-[#ffffff] cursor-pointer rounded-3xl border-2 border-gray-200 flex flex-col items-center transition-transform duration-200 hover:scale-110"
                 onClick={handleClick}
            >
                <div className=" relative w-[270px] h-[60px] bg-[#ffffff] rounded-3xl flex flex-row items-center justify-between">
                    <h3 className="text-[#323232] text-[19px]">
                        {file.name || "Unbenannt"}
                    </h3>
                    <button className=""
                            onClick={handleOptionClick}
                    >
                        <EllipsisHorizontalIcon className="w-7 h-7 text-[#777777]"/>
                        {showOption && (
                            <div className="absolute top-10 right-0 bg-[#efefef] border rounded shadow p-2 z-50 space-y-2">
                                <button
                                    className="text-red-600 font-semibold hover:underline block"
                                    onClick={handleDelete}
                                >
                                    Datei Löschen
                                </button>
                                <button
                                    className="text-blue-600 font-semibold hover:underline block"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsRenaming(true);
                                        setShowOptions(false);
                                    }}
                                >
                                    Datei Umbenennen
                                </button>
                            </div>
                        )}
                    </button>
                </div>
                <div className="bg-[#CFEFD4] w-[270px] h-[135px] rounded-3xl ">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt="Dateivorschau"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-sm text-gray-600">Keine Vorschau</span>
                    )}
                </div>
            </div>
            {isRenaming && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-[300px] text-center">
                        <h3 className="text-lg font-semibold">Datei umbenennen</h3>
                        <input
                            type="text"
                            className="w-full border rounded px-2 py-1"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-1 rounded"
                                onClick={handleRename}
                            >
                                Speichern
                            </button>
                            <button
                                className="text-gray-500 hover:underline"
                                onClick={() => setIsRenaming(false)}
                            >
                                Abbrechen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default Files;