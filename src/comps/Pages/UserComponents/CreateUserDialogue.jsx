import React, {useEffect} from "react";
import {RoleSelector} from "./RoleSelector";
import {FileComment} from "../FileComponents/FileComment";

export function CreateUserDialogue({ onSubmit, onCancelCreate, setForm, form, error, isCreating }) {
    useEffect(() => {
        setForm(f => ({ ...f, role: "VIEWER" }));
    }, []);

    function validate(f) {
        if (!f.username.trim()) {
            return "Name is required.";
        }

        if (!f.email.trim()) {
            return "Email is required.";
        }

        const ok = /.+@.+\..+/.test(f.email);

        if (!ok) {
            return "Please enter a valid email.";
        }

        return "";
    }

    const handelRoleChange = (e) => {
        setForm(f => ({ ...f, role: e }));
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold">Create User</h2>
                {error && (
                    <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={e => onSubmit(e, form)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="flex-1">
                        <span className="mb-1 block text-xs font-medium text-gray-600">Name</span>
                        <input value={form.username} placeholder="Jane Doe"
                               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                               onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        />
                    </label>
                    <label className="flex-1">
                        <span className="mb-1 block text-xs font-medium text-gray-600">Email</span>
                        <input value={form.email} placeholder="jane.doe@example.com"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                    </label>
                    <label className="flex-1">
                        <span className="mb-1 block text-xs font-medium text-gray-600">Role</span>
                        <RoleSelector onChange={handelRoleChange}/>
                    </label>
                    <div className="flex gap-2">
                        <button type="submit" disabled={!!validate(form)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                            Save
                        </button>
                        {isCreating && (
                            <button type="button" onClick={onCancelCreate} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}