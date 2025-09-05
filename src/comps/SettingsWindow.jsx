import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider.jsx";

function SettingsWindow({ onClose }) {
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    return (
        <div className="absolute left-full ml-2 top-40 p-4 bg-white dark:bg-gray-800 shadow-lg rounded">
            <h3 className="text-sm font-bold mb-2 text-gray-800 dark:text-white">Einstellungen</h3>
            <button
                className="text-sm text-blue-600 dark:text-blue-300"
                onClick={() => setDarkMode(prev => !prev)}
            >
                Dark Mode: {darkMode ? "Aktiviert" : "Deaktiviert"}
            </button>
            <button onClick={onClose} className="mt-2 text-xs text-gray-400 hover:text-red-500">Schließen</button>
        </div>
    );
}

export default SettingsWindow;