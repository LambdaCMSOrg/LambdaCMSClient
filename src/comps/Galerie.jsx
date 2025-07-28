import Files from "./Files.jsx";
import MediaUpload from "./MediaUpload.jsx";
import {useState, useEffect} from "react";
import {getImages} from "../common/Api";

function Galerie() {
    const [showUpload, setShowUpload] = useState(false);

    const [files, setFiles] = useState([]);

    const handleUploadSuccess = (newFile) => {
        setFiles((prev) => [...prev, ...newFile]);
        setShowUpload(false);
    };

    const handleDeleteFromParent = (id) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    };

    useEffect(() => {
        const fetchFiles = async () => {
            const result = await getImages();

            if (!result.success) {
                alert(result.error);
                return;
            }

            setFiles(result.files);
        };

        fetchFiles();
    }, []);

    return (
        <div className="flex-1 h-screen bg-[#F1FFFB] p-20">
            <div className="w-full h-40 flex justify-between">
                <div className="">
                    <h2 className="text-[34px] font-bold text-[#444444]">Galerie</h2>
                    <p className=" text-[#555555]">upload your Content</p>
                </div>
                <div className="flex justify-center">
                    <button onClick={() => setShowUpload(true)}
                            className="flex h-12 w-12 bg-[#07797a] shadow-[0_6px_9px_-2px_rgba(0,0,0,0.6)] rounded-full justify-center items-center font-bold text-[#f1fffb] text-[30px] transition-transform duration-200 hover:scale-110">
                        +
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {files.map((file) => (
                    <Files key={file.id} file={file} onDelete={handleDeleteFromParent}/>
                ))}
            </div>
            {showUpload && (
                <MediaUpload
                    onClose={() => setShowUpload(false)}
                    onUploadSuccess={handleUploadSuccess}
                />
            )}
        </div>
    );
}

export default Galerie;