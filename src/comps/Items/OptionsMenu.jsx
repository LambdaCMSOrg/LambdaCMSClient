import {EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import {useEffect, useRef, useState} from "react";

export default function OptionsMenu({ handleDelete, setIsRenaming }) {
    const dropdownRef = useRef(null);

    const [isVisible, setIsVisible] = useState(false);

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
    };

    const handleRename = async (e) => {
        e.stopPropagation();
        setIsVisible(false);

        setIsRenaming(true);
    };

    return <div ref={dropdownRef}>
        <button className="" onClick={handleClick}>
            <EllipsisHorizontalIcon className="w-7 h-7 text-[#777777]" />
        </button>
        {isVisible && (
            <div className="absolute top-10 right-0 bg-[#efefef] border rounded shadow p-2 z-50 space-y-2">
                <button className="text-red-600 font-semibold hover:underline block" onClick={handleDelete}>
                    Delete
                </button>
                <button className="text-blue-600 font-semibold hover:underline block" onClick={handleRename}>
                    Rename
                </button>
            </div>
        )}
    </div>;
}