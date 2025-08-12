import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function FolderCloseItem({ onCloseFolder }) {
    const handleClick = async (e) => {
        e.preventDefault();

        onCloseFolder();
    };

    return(
        <>
            <div className="w-[330px] h-[225px] bg-[#ffffff] cursor-pointer rounded-3xl border-2 border-gray-200 flex flex-col items-center transition-transform duration-200 hover:scale-110"
                 onClick={handleClick}>
                <div className=" relative w-[270px] h-[60px] bg-[#ffffff] rounded-3xl flex flex-row items-center justify-between"/>
                <div className="bg-[#CFEFD4] w-[270px] h-[135px] rounded-3xl relative overflow-hidden">
                    <ArrowUturnLeftIcon className="absolute top-0 left-0 w-full h-full text-[#61FC86B3] object-cover"/>
                </div>
            </div>
        </>
    );
}