import React from "react";

export function LogEntry({ log }) {
    const [showFullId, setShowFullId] = React.useState(false);

    const getLevel = level => {
        switch (level) {
            case "Information":
                return "INFO";

            case "Warning":
                return "WARN";

            case "Error":
                return "ERROR";
        }
    }

    const getLevelColor = level => {
        switch(level) {
            case 'Information': return 'text-blue-400';
            case 'Warning': return 'text-yellow-400';
            case 'Error': return 'text-red-500';

            default: return 'text-gray-400';
        }
    }

    const getShortUserId = (id) => {
        return `${id.substring(0, 3)}...${id.substring(id.length - 3)}`;
    };

    return (
        <div className="mb-1">
            <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>{' '}
            <span className={getLevelColor(log.level)}>[{getLevel(log.level)}]</span>{' '}
            <span className="text-green-400">{log.username}
                <span onClick={() => setShowFullId(!showFullId)} className="cursor-pointer text-gray-400 hover:text-gray-200 ml-1" >
                    ({showFullId ? log.userId : getShortUserId(log.userId)})
                </span>
            </span>{': '}
            {log.message}
        </div>
    )
}