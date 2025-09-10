import { useEffect } from "react";

export default function TelegramLogin({ setUserId }) {
    useEffect(() => {
        if (document.getElementById("telegram-login-script")) return;

        const script = document.createElement("script");
        script.id = "telegram-login-script"; // prevent duplicates
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "musteri_temsilcisi_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-onauth", "onTelegramAuth");
        script.setAttribute("data-request-access", "write");

        document.getElementById("telegram-login-container")?.appendChild(script);

        window.onTelegramAuth = (user) => {
            console.log("Logged in:", user);
            setUserId(user.id);
            localStorage.setItem("telegramUser", JSON.stringify(user));
        };
    }, [setUserId]);

    return (
        <div>
            <div id="telegram-login-container" />
            <p style={{ color: "red", marginTop: "8px" }}>
                If Telegram login doesn't appear, please refresh the page.
            </p>
        </div>
    );

}
