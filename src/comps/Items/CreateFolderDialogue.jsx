import { useState } from "react";
import { createFolder } from "../../common/ApiService";

export default function CreateFolderDialogue({ folder, onSuccess, onClose }) {
    const [name, setName] = useState("");

    function isNullOrWhiteSpace(str) {
        return str == null || str.trim() === '';
    }

    const handleCreateFolder = async () => {
        if (isNullOrWhiteSpace(name)) {
            alert("Invalid folder name.");
            return;
        }

        const result = await createFolder(name, folder);

        if (!result.success) {
            alert(result.error);
            return;
        }

        onSuccess(result.file);
    };

    return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-[300px] text-center">
            <h3 className="text-lg font-semibold">Create Folder</h3>

            <input type="text" className="w-full border rounded px-2 py-1" onChange={(e) => setName(e.target.value)}/>
            <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleCreateFolder}>
                    Save
                </button>
                <button className="text-gray-500 hover:underline" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    </div>;
}