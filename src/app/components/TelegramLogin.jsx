"use client";

import { useState, useEffect } from "react";

export default function TelegramLogin({ setUserId }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("telegramUser");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        // Telegram auth callback
        window.onTelegramAuth = (user) => {
            console.log("Logged in:", user);
            setUser(user);
            setUserId(user.id);
            localStorage.setItem("telegramUser", JSON.stringify(user));
        };
    }, [setUserId]);

    const handleLoginClick = () => {
        // Remove any existing script to prevent duplicates
        const oldScript = document.getElementById("telegram-login-script");
        if (oldScript) oldScript.remove();

        const script = document.createElement("script");
        script.id = "telegram-login-script";
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "musteri_temsilcisi_bot"); // your bot username
        script.setAttribute("data-size", "large");
        script.setAttribute("data-onauth", "onTelegramAuth");
        script.setAttribute("data-request-access", "write");

        document.body.appendChild(script);
    };

    if (user) return null; // Hide button if already logged in

    return (
        <button
            onClick={handleLoginClick}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 1000,
                padding: "12px 16px",
                backgroundColor: "#0088cc",
                color: "#fff",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                fontWeight: "bold",
            }}
            title="Login with Telegram"
        >
            Telegram Login

        </button>
    );
}
