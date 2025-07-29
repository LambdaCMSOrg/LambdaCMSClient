import {useState} from "react";

export default function FileRenameDialogue({ name, handleRename, setIsRenaming }) {
    const [newName, setNewName] = useState(name || "");

    return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-[300px] text-center">
            <h3 className="text-lg font-semibold">Rename file</h3>

            <input type="text" className="w-full border rounded px-2 py-1" value={newName} onChange={(e) => setNewName(e.target.value)}/>
            <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => handleRename(newName)}>
                    Save
                </button>
                <button className="text-gray-500 hover:underline" onClick={() => setIsRenaming(false)}>
                    Cancel
                </button>
            </div>
        </div>
    </div>;
}