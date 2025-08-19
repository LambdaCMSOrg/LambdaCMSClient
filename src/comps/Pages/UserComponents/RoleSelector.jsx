import {useState} from "react";

export function RoleSelector({ onChange, defaultSelected }) {
    const [selected, setSelected] = useState(defaultSelected);

    const options = [
        { value: "VIEWER" },
        { value: "EDITOR" },
        { value: "ADMIN" },
    ];

    const handleSelectionChanged = e => {
        setSelected(e.target.value);

        onChange(e.target.value);
    }

    return (
        <div className="w-24">
            <select value={selected} onChange={handleSelectionChanged} className="block w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.value}
                    </option>
                ))}
            </select>
        </div>
    );
}