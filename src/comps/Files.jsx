import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

function Files({ file = {}, onDelete }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showOption, setShowOptions] = useState(false);

    const handleOptionClick = (e) => {
        e.stopPropagation();
        setShowOptions(prev => !prev);
    }

    const handleClick = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5158/file/image/${file.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (error) {
            console.error("Fehler beim Laden der Datei:",error);
            alert("Fehler beim Laden der Datei");
        }
    };
    console.log("file object:", file);

    const handleDelete = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5158/file/${file.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (onDelete !== undefined) {
                onDelete(file.id);
            }
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            alert("Datei konnte nicht gelöscht werden");
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
            <div className="w-[330px] h-[225px] bg-[#ffffff] rounded-3xl border-2 border-gray-200 flex flex-col items-center transition-transform duration-200 hover:scale-110"
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
                            <div className="absolute top-10 right-0 bg-[#efefef] border rounded shadow p-2 z-50">
                                <button className="text-red-600 font-semibold hover:underline"
                                        onClick={handleDelete}
                                >Datei Löschen</button>
                            </div>
                        )}
                    </button>
                </div>
                <div className="bg-[#CFEFD4] w-[270px] h-[135px] rounded-3xl ">
                    {file.thumbnailUrl ? (
                        <img
                            src={file.thumbnailUrl}
                            alt="Dateivorschau"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-sm text-gray-600">Keine Vorschau</span>
                    )}
                </div>
            </div>
        </>
    );
}
export default Files;