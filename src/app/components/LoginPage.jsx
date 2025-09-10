import React, { useState, useEffect, useRef } from 'react';

export default function App() {
    const [user, setUser] = useState(null);
    const [loginError, setLoginError] = useState(false); // New state for error
    const containerRef = useRef(null);

    useEffect(() => {
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

        window.onTelegramAuth = (authUser) => {
            console.log("Logged in:", authUser);
            setUser(authUser);
            localStorage.setItem("telegramUser", JSON.stringify(authUser));
            setLoginError(false); // Clear any previous error
        };

        if (containerRef.current && !document.getElementById("telegram-login-script")) {
            const script = document.createElement("script");
            script.id = "telegram-login-script";
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.async = true;

            // Add the onerror event listener for fallback
            script.onerror = () => {
                console.error("Failed to load Telegram login script.");
                setLoginError(true);
            };

            script.setAttribute("data-telegram-login", "musteri_temsilcisi_bot");
            script.setAttribute("data-size", "large");
            script.setAttribute("data-onauth", "onTelegramAuth");
            script.setAttribute("data-request-access", "write");

            containerRef.current.appendChild(script);
        }

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
                    // ... (your existing user display code)
                    <div>User details...</div>
                ) : (
                    // Display Telegram login widget or fallback
                    <div className="flex flex-col items-center">
                        <p className="text-gray-600 mb-6">
                            Please log in with Telegram to access your details.
                        </p>
                        {loginError ? (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center shadow-md">
                                <p>Error loading login button. Please check your internet connection or try again later.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 text-red-500 hover:text-red-600 font-semibold transition-colors duration-300"
                                >
                                    Reload Page
                                </button>
                            </div>
                        ) : (
                            <div ref={containerRef} className="my-4" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}