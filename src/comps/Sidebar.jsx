import {
    UserIcon,
    ChartBarIcon,
    PhotoIcon,
    Squares2X2Icon,
    Cog8ToothIcon,
    ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import SidebarButton from "./SidebarButton";
import { useState } from "react";
import {isCurrentUserAdmin} from "../common/ApiService";
import {ShieldCheckIcon} from "@heroicons/react/24/solid";
import SettingsWindow from "./SettingsWindow.jsx"

function Sidebar() {

    const [showSettings, setShowSettings] = useState(false);

    const mainButtons = [
        {label: 'Dashboard', icon: Squares2X2Icon, to: '/'},
        {label: 'Activity', icon: ChartBarIcon, to: '/activity'},
        {label: 'Gallery', icon: PhotoIcon, to: '/gallery'},
    ];

    if (isCurrentUserAdmin()) {
        mainButtons.push({label: 'Admin Panel', icon: UserIcon, to: '/admin/users'});
        mainButtons.push({label: 'Audit Log', icon: ShieldCheckIcon, to: '/admin/audit'});
    }

    const bottomButtons = [
        {label: 'Settings', icon: Cog8ToothIcon},
        {label: 'Logout', icon: ArrowLeftStartOnRectangleIcon}
    ];

    return(
        <div className="w-[250px] h-screen bg-[var(--color-bgAccent)] flex flex-col justify-between">
            <div className="w-full h-[200px] flex items-center justify-center">
                <h2 className="text-[30px] font-extrabold text-[var(--color-textP)]">Lambda CMS</h2>
            </div>
            <div className="w-full h-[400px] flex items-center justify-start flex-col">
                {mainButtons.map(({label, icon, to}) => (
                    <SidebarButton key={label} label={label} Icon={icon} to={to} className="flex flex-row " />
                ))}
            </div>
            <div className="w-full h-[400px] flex items-center justify-end flex-col relative">
                {bottomButtons.map(({label, icon}) => (
                    <SidebarButton
                        key={label}
                        label={label}
                        Icon={icon}
                        className=""
                        onClick={label === "Settings" ? () => {
                                setShowSettings(prev => !prev);
                                console.log("Toggle:", !showSettings);
                            } : undefined}
                    />
                ))}
                {showSettings && (
                    <SettingsWindow onClose={() => setShowSettings(false)} />
                )}
            </div>
        </div>
    );
}
export default Sidebar;
