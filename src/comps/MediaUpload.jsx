import {useRef} from "react";

function MediaUpload({ onClose, onUploadSuccess }) {
    const fileInputRef = useRef();

    const handleFiles = async (files) => {
        const token = localStorage.getItem("token");
        console.log(token);

        const formData = new FormData();
        for (const file of files) {
            formData.append("Name", file.name);
            formData.append("File", file);
        }

        try {
            const res = await fetch("http://localhost:5158/api/image", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            const uploadedFiles = Array.isArray(data) ? data : [data];
            onUploadSuccess(uploadedFiles);

            // alert("Upload erfolgreich!");
            onClose();
        } catch (err) {
            alert("Fehler beim Upload: " + err.message);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // nötig, damit Drop funktioniert
    };

    const handleSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        handleFiles(e.target.files);
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