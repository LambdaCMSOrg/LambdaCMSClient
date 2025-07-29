import {EllipsisHorizontalIcon} from "@heroicons/react/24/solid";

export default function OptionsMenu({ showOptions, setShowOptions, handleDelete, setIsRenaming }) {
    const handleOptionClick = (e) => {
        e.stopPropagation();
        setShowOptions(prev => !prev);
    };

    const handleRename = async (e) => {
        e.stopPropagation();
        setIsRenaming(true);
        setShowOptions(false);
    };

    return <>
        <button className="" onClick={handleOptionClick}>
            <EllipsisHorizontalIcon className="w-7 h-7 text-[#777777]" />
        </button>
        {showOptions && (
            <div className="absolute top-10 right-0 bg-[#efefef] border rounded shadow p-2 z-50 space-y-2">
                <button className="text-red-600 font-semibold hover:underline block" onClick={handleDelete}>
                    Delete
                </button>
                <button className="text-blue-600 font-semibold hover:underline block" onClick={handleRename}>
                    Rename
                </button>
            </div>
        )}
    </>;
}