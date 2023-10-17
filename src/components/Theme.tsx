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
        <div className='absolute top-10 lg:right-10 sm:center-10 md:center-10'>
            <button
                onClick={() => {
                    setDarkMode(!darkMode);
                }}
                className='dark:bg-stone-300 dark:text-black bg-gray-800 text-white px-5 py-3 rounded hover:bg-stone-700 dark:hover:bg-white'
            >
                {darkMode ? (
                    <i className='fa-regular fa-sun'></i>
                ) : (
                    <i className='fa-solid fa-moon'></i>
                )}{" "}
            </button>
        </div>
    );
}
