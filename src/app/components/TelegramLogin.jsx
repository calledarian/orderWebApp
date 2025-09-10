"use client";

import { useState, useEffect } from "react";

export default function TelegramLogin({ setUserId }) {
    const [user, setUser] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const stored = localStorage.getItem("telegramUser");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setUserId(parsed.id);
        }

        window.onTelegramAuth = (user) => {
            console.log("Logged in:", user);
            setUser(user);
            setUserId(user.id);
            localStorage.setItem("telegramUser", JSON.stringify(user));
        };

        // Dynamically load Telegram script once on client
        if (isClient && !document.getElementById("telegram-login-script")) {
            const script = document.createElement("script");
            script.id = "telegram-login-script";
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.async = true;
            document.body.appendChild(script);
        }
    }, [isClient, setUserId]);

    if (!isClient || user) return null;

    return (
        <div
            className="telegram-login-widget"
            data-telegram-login="musteri_temsilcisi_bot" // your bot username
            data-size="large"
            data-onauth="onTelegramAuth"
            data-request-access="write"
            style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
        ></div>
    );
}
