import React, { useState, useEffect, useRef } from 'react';

// Main App component containing all logic and UI
export default function App() {
    const [user, setUser] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Check for a stored user in local storage on initial load
        const stored = localStorage.getItem("telegramUser");
        if (stored) {
            try {
                const parsedUser = JSON.parse(stored);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem("telegramUser");
            }
            return;
        }

        // This function will be called by the Telegram widget upon successful login
        window.onTelegramAuth = (authUser) => {
            console.log("Logged in:", authUser);
            setUser(authUser);
            localStorage.setItem("telegramUser", JSON.stringify(authUser));
        };

        // Dynamically create and append the Telegram login script
        // This is done only if the script isn't already present
        if (containerRef.current && !document.getElementById("telegram-login-script")) {
            const script = document.createElement("script");
            script.id = "telegram-login-script";
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.async = true;
            // Set the attributes for your bot
            script.setAttribute("data-telegram-login", "musteri_temsilcisi_bot");
            script.setAttribute("data-size", "large");
            script.setAttribute("data-onauth", "onTelegramAuth");
            script.setAttribute("data-request-access", "write");

            containerRef.current.appendChild(script);
        }

        // Cleanup function to remove the global callback
        return () => {
            window.onTelegramAuth = null;
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("telegramUser");
        setUser(null);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    KYC Ordering App
                </h1>

                {user ? (
                    // Display user details if logged in
                    <div className="flex flex-col items-center text-center">
                        {user.photo_url && (
                            <img
                                src={user.photo_url}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg mb-4"
                            />
                        )}
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            Hello, {user.first_name} {user.last_name}!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Welcome to your personal ordering dashboard.
                        </p>

                        <div className="w-full text-left bg-indigo-50 p-6 rounded-lg space-y-3 shadow-inner">
                            <div className="flex items-center">
                                <span className="font-medium text-indigo-700 w-24">ID:</span>
                                <span className="text-gray-800 break-all">{user.id}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium text-indigo-700 w-24">Username:</span>
                                <span className="text-gray-800 break-all">@{user.username}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-medium text-indigo-700 w-24">Language:</span>
                                <span className="text-gray-800 break-all">{user.language_code}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    // Display Telegram login widget if not logged in
                    <div className="flex flex-col items-center">
                        <p className="text-gray-600 mb-6">
                            Please log in with Telegram to access your details.
                        </p>
                        <div ref={containerRef} className="my-4" />
                    </div>
                )}
            </div>
        </div>
    );
}
