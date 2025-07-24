import {
    UserIcon,
    ChartBarIcon,
    PhotoIcon,
    Squares2X2Icon,
    Cog8ToothIcon,
    ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import Sidebarbutton from "./Sidebarbutton";

function Sidemenu() {

    const mainButtons = [
        {label: 'Dashboard', icon: Squares2X2Icon, to: '/'},
        {label: 'User', icon: UserIcon, to: '/user'},
        {label: 'Activity', icon: ChartBarIcon, to: '/activity'},
        {label: 'Galerie', icon: PhotoIcon, to: '/galerie'},
    ];

    const bottomButtons = [
        {label: 'Einstellung', icon: Cog8ToothIcon},
        {label: 'Logout', icon: ArrowLeftStartOnRectangleIcon}
    ];

    return(
        <div className="w-[300px] h-screen bg-[#09797A]">
            <div className="w-full h-[200px] flex items-center justify-center">
                <h2 className="text-[30px] font-extrabold text-[#ffffff]">Lambda CMS</h2>
            </div>
            <div className="w-full h-[400px] flex items-center justify-start flex-col">
                {mainButtons.map(({label, icon, to}) => (
                    <Sidebarbutton key={label} label={label} Icon={icon} to={to} className="flex flex-row " />
                ))}
            </div>
            <div className="w-full h-[400px] flex items-center justify-end flex-col ">
                {bottomButtons.map(({label, icon}) => (
                    <Sidebarbutton key={label} label={label} Icon={icon} className="" />
                ))}
            </div>
        </div>
    );
}
export default Sidemenu;
