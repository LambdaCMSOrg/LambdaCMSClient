import React, {useEffect, useMemo, useState} from "react";
import {DeleteUserDialogue} from "./UserComponents/DeleteUserDialogue";
import {AdjustmentsHorizontalIcon, TrashIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import {CreateUserDialogue} from "./UserComponents/CreateUserDialogue";
import {RoleSelector} from "./UserComponents/RoleSelector";
import {EditUserDialogue} from "./UserComponents/EditUserDialogue";
import {createUser, deleteUser, getUsers, updateUser} from "../../common/ApiService";

const emptyForm = { id: null, username: "", email: "", password: "Psw1234!", role: "" };

export function AdminPanel() {
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState(emptyForm);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) {
            return users;
        }

        return users.filter(u =>
            u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
    }, [users, query]);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getUsers();

            if (!result.success) {
                alert(result.error);
            }
            else {
                setUsers(result.users);
            }
        };

        fetchUsers();
    }, []);

    function startCreate() {
        setForm(emptyForm);
        setIsEditing(false);
        setIsCreating(true);
        setError("");
    }

    function startEdit(u) {
        setForm({ ...u });
        setIsEditing(true);
        setIsCreating(false);
        setError("");
    }

    function startRemove(user) {
        setPendingDelete(user);
    }

    function cancelEditAndCreate() {
        setForm(emptyForm);
        setIsEditing(false);
        setIsCreating(false)
        setError("");
    }

    async function handleCreate(e, form) {
        e.preventDefault();

        if (isCreating) {
            const result = await createUser(form.username, form.email, form.password, form.role);

            if (!result.success) {
                setError(result.error);
                return;
            }

            setUsers(prev => [...prev, result.user]);
        }

        cancelEditAndCreate();
    }

    async function handleEdit(e, form) {
        e.preventDefault();

        if (isEditing) {
            const result = await updateUser(form.id, form.username, form.email, form.role);

            if (!result.success) {
                setError(result.error);
                return;
            }

            setUsers(prev => prev.map(u => (u.id === form.id ? result.user : u)));
        }

        cancelEditAndCreate();
    }

    async function performDelete(user) {
        if (isEditing && form.id === pendingDelete.id) {
            cancelEditAndCreate();
        }

        setPendingDelete(null);

        const result = await deleteUser(user.id);

        if (!result.success) {
            console.log(result);
            alert(result.error);
        }
        else {
            setUsers(prev => prev.filter(x => x.id !== user.id));
        }
    }

    function cancelDelete() {
        setPendingDelete(null);
    }

    return (
        <div className="h-screen bg-[#F1FFFB]">
            <div className="mx-auto px-24 py-20">
                <div className="mb-24 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-[34px] font-bold text-[#444444]">User Administration</h2>
                        <p className=" text-[#555555]">Create, edit, and remove users.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                               placeholder="Search name or email…" value={query} onChange={e => setQuery(e.target.value)}/>
                        <button type="button" onClick={startCreate} className="rounded-lg border text-white border-gray-300 px-3 py-2 text-sm  bg-blue-600 hover:bg-blue-500">
                            <UserPlusIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Role</th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">No users found.</td>
                            </tr>
                        )}
                        {filtered.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.username}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{u.role}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => startEdit(u)} className="rounded-lg px-3 py-1.5 text-sm shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                                            <AdjustmentsHorizontalIcon className="w-5 h-5"/>
                                        </button>
                                        <button type="button" onClick={() => startRemove(u)} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">
                                            <TrashIcon className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {pendingDelete && (<DeleteUserDialogue user={pendingDelete} onConfirm={performDelete} onCancel={cancelDelete} />)}
                {(isCreating) && <CreateUserDialogue onSubmit={handleCreate} onCancelCreate={cancelEditAndCreate} setForm={setForm} form={form} error={error} isCreating={isCreating}/>}
                {(isEditing) && <EditUserDialogue onSubmit={handleEdit} onCancelEdit={cancelEditAndCreate} setForm={setForm} form={form} error={error} isEditing={isEditing}/>}
            </div>
        </div>
    );
}