import Files from "./Files.jsx";

function Dashboard() {
    return (
        <div className="flex-1 h-screen bg-[#F1FFFB] p-20">
            <div className="w-full h-40">
                <h2 className="text-[34px] font-bold text-[#444444]">Dashboard</h2>
                <p className=" text-[#555555]">Latest uploaded Content</p>
            </div>
            <div className="w-full flex flex-row justify-between">
                <Files/>
                <Files/>
                <Files/>
                <Files/>
            </div>
        </div>
    );
}
export default Dashboard;