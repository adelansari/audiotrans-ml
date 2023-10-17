import { useEffect, useState } from "react";

export default function Theme() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => {
                setDarkMode(!darkMode);
            }}
            className='absolute right-10 top-10 dark:bg-white dark:text-black bg-black text-white px-5 py-3 rounded hover:bg-stone-700'
        >
            {darkMode ? "Light" : "Dark"} Mode
        </button>
    );
}
