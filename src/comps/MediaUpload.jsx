import {useRef} from "react";
import {uploadFile} from "../common/ApiService";

function MediaUpload({ folder, onClose, onUploadSuccess }) {
    const fileInputRef = useRef();

    const handleUpload = async (file) => {
        const result = await uploadFile(file, folder);

        if (!result.success) {
            alert(result.error);
            return;
        }

        onUploadSuccess(result.file);
    };

    const handleDrop = async (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length > 0) {
            await handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // necessary for Drop to work.
    };

    const handleSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        await handleUpload(e.target.files[0]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[400px] text-center" onDrop={handleDrop} onDragOver={handleDragOver}>
                <h3 className="text-lg font-bold mb-4">Upload file</h3>
                <p className="mb-4 text-sm text-gray-500">Drag files here or select manually .</p>

                <button onClick={handleSelect} className="bg-[#07797a] text-white px-4 py-2 rounded hover:bg-[#065f5f]">
                    Select File
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".png,.jpg,.jpeg,.mp4" className="hidden"/>

                <button onClick={onClose} className="mt-6 text-sm text-gray-400 hover:underline block">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default MediaUpload;