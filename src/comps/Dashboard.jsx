import FileItem from "./Items/FileItem.jsx";
import {useEffect, useState} from "react";
import {queryFiles} from "../common/ApiService";

function Dashboard() {
    const fileQuery = {
        "sortBy": {
            "sortByCreationDate": true
        },
        "limit": 12
    }

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const result = await queryFiles(fileQuery);

            if (!result.success) {
                alert(result.error);
            }
            else {
                setFiles(result.files.slice(0, 12));
            }
        };

        fetchFiles();
    });

    return (
        <div className="flex-1 h-screen bg-[#F1FFFB] p-20">
            <div className="w-full h-40">
                <h2 className="text-[34px] font-bold text-[#444444]">Dashboard</h2>
                <p className=" text-[#555555]">Latest uploaded Content</p>
            </div>
            <div className="w-full flex flex-row justify-between">
                {files.map((file) => (
                    <FileItem key={file.id} file={file} showOptions={false}/>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;