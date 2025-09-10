// In your Next.js component or page
import React, { useEffect } from 'react';

const LoginPage = () => {
    useEffect(() => {
        // This script will load the Telegram widget
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'musteri_temsilcisi_bot'); // Replace with your bot's username
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)'); // Callback function
        script.setAttribute('data-request-access', 'write'); // Optional: request write access
        script.async = true;
        document.getElementById('telegram-login-button').appendChild(script);

        // Define the global callback function
        window.onTelegramAuth = (user) => {
            // Handle the authenticated user data here
            console.log('Logged in as:', user);
            // You can send this user data to your backend for further processing
            // or store it in your application's state/context
        };
    }, []);

    return (
        <div>
            <h1>Login with Telegram</h1>
            <div id="telegram-login-button"></div>
        </div>
    );
};

export default LoginPage;