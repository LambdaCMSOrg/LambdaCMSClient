import {LogEntry} from "./LogPanel/LogEntry";
import React, {useEffect, useMemo, useState} from "react";
import {LabeledCheckbox} from "../Utility/LabeledCheckbox";
import {getAuditLogs} from "../../common/ApiService";

export function LogPanel() {
    const scrollRef = React.useRef(null);

    const [showInfo, setShowInfo] = React.useState(true);
    const [showWarning, setShowWarning] = React.useState(true);
    const [showError, setShowError] = React.useState(true);

    const [search, setSearch] = useState('');

    const [logs, setLogs] = useState([]);

    const shouldEntryShow = (log) => {
        return (showInfo && log.level === "Information" || showWarning && log.level === "Warning" || showError && log.level === "Error") &&
            (!search ||
            //log.username.toLowerCase().includes(search.toLowerCase()) ||
            log.message.toLowerCase().includes(search.toLowerCase()));
    }

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            return shouldEntryShow(log);
        });
    }, [logs, search, showInfo, showWarning, showError]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        const fetchLogs = async () => {
            const result = await getAuditLogs("Information");

            if (!result.success) {
                return;
            }

            setLogs(result.logs);
        }

        fetchLogs();
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [filteredLogs]);

    return (
        <div className="h-screen bg-[#F1FFFB]">
            <div className="mx-auto px-24 py-20">
                <div className="mb-24 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-[34px] font-bold text-[#444444]">Audit Log</h2>
                        <p className=" text-[#555555]">View log entries.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Search..." value={search} onChange={handleSearch} className="flex-1 p-1 pr-16 mr-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <LabeledCheckbox label="Info" checked={showInfo} onChange={setShowInfo} />
                        <LabeledCheckbox label="Warning" checked={showWarning} onChange={setShowWarning} />
                        <LabeledCheckbox label="Error" checked={showError} onChange={setShowError} />
                    </div>
                </div>

                <div ref={scrollRef} className="bg-gray-600 text-gray-50 font-mono text-sm p-3 rounded shadow-inner max-h-[500px] overflow-y-auto">
                    <div className="min-w-full p-4 flex flex-col gap-2">
                        { filteredLogs.map((entry) => <LogEntry key={entry.id} log={entry} />) }
                    </div>
                </div>
            </div>
        </div>
    )
}