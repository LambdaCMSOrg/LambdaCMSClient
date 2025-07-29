import {useRef} from "react";
import {uploadImage} from "../common/Api";

function MediaUpload({ onClose, onUploadSuccess }) {
    const fileInputRef = useRef();

    const handleFiles = async (files) => {
        const result = await uploadImage(files);

        if (!result.success) {
            alert(result.error);
        }

        onUploadSuccess(result.files);

        onClose();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        await handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // nötig, damit Drop funktioniert
    };

    const handleSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        await handleFiles(e.target.files);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
                className="bg-white p-6 rounded shadow-lg w-[400px] text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <h3 className="text-lg font-bold mb-4">Dateien hochladen</h3>
                <p className="mb-4 text-sm text-gray-500">Ziehe Dateien hierhin oder wähle sie manuell aus.</p>

                <button
                    onClick={handleSelect}
                    className="bg-[#07797a] text-white px-4 py-2 rounded hover:bg-[#065f5f]"
                >
                    Dateien auswählen
                </button>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    onClick={onClose}
                    className="mt-6 text-sm text-gray-400 hover:underline block"
                >
                    Abbrechen
                </button>
            </div>
        </div>
    );
}

export default MediaUpload;