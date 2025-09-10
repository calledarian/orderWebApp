"use client";

import { useState, useEffect, useRef } from "react";

export default function TelegramLogin({ setUserId }) {
    const [user, setUser] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Load stored user
        const stored = localStorage.getItem("telegramUser");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setUserId(parsed.id);
            return; // already logged in
        }

        // Telegram auth callback
        window.onTelegramAuth = (user) => {
            console.log("Logged in:", user);
            setUser(user);
            setUserId(user.id);
            localStorage.setItem("telegramUser", JSON.stringify(user));
        };

        // Create Telegram widget dynamically
        if (containerRef.current && !document.getElementById("telegram-login-script")) {
            const script = document.createElement("script");
            script.id = "telegram-login-script";
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.async = true;
            script.setAttribute("data-telegram-login", "musteri_temsilcisi_bot"); // your bot username
            script.setAttribute("data-size", "large");
            script.setAttribute("data-onauth", "onTelegramAuth");
            script.setAttribute("data-request-access", "write");

            containerRef.current.appendChild(script);
        }
    }, [setUserId]);

    if (user) return null; // hide if already logged in

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 1000,
            }}
        />
    );
}
