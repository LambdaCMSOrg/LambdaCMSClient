import { Link, useNavigate } from "react-router-dom";

function SidebarButton({label, Icon, to }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (label === "Logout") {

            navigate("/login");
        }
    };

    return(
        <div className="flex justify-end items-center w-full h-[5em]">
            {label === "Logout" ? (
                <button
                    onClick={handleClick}
                    className="flex items-center gap-3 px-4 py-2 text-white rounded w-[230px] transition-transform duration-200 hover:scale-110">
                    <Icon className="w-5 h-5 text-[#CFEFD4]" />
                    <span className="text-xl font-medium text-[#CFEFD4]">{label}</span>
                </button>
            ) : (
                <Link
                    to={to}
                    className="flex items-center gap-3 px-4 py-2 text-white rounded w-[230px] transition-transform duration-200 hover:scale-110">
                    <Icon className="w-5 h-5 text-[#CFEFD4]"/>
                    <span className="text-xl font-medium text-[#CFEFD4]">{label}</span>
                </Link>
            )}
        </div>
    );
}
export default SidebarButton;