import React from "react";

export function DeleteUserDialogue({user, onConfirm, onCancel}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-6 shadow-lg">
                <p className="mb-4">Delete user "{user.username}"?</p>
                <div className="flex gap-2 justify-end">
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50" onClick={onCancel}>Cancel</button>
                    <button className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700" onClick={() => onConfirm(user)}>Delete</button>
                </div>
            </div>
        </div>
    )
}