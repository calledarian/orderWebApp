// ProfilePage.jsx
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';

export default function ProfilePage({ user, setUser, isLogged, setIsLogged }) {
  useEffect(() => {
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLogged(true);
    }

    if (!storedUser) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'musteri_temsilcisi_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;

      const container = document.getElementById('telegram-login-button');
      if (container) container.appendChild(script);
    }

    window.onTelegramAuth = (userData) => {
      setUser(userData);
      setIsLogged(true);
      localStorage.setItem('telegramUser', JSON.stringify(userData));
    };
  }, [setUser, setIsLogged]);

  const handleLogout = () => {
    localStorage.removeItem('telegramUser');
    setUser(null);
    setIsLogged(false);
    window.location.reload();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
      {!user && <div id="telegram-login-button"></div>}

      {user && (
        <Card sx={{ minWidth: 300, textAlign: 'center', p: 2 }}>
          <CardContent>
            {user.photo_url && <Avatar src={user.photo_url} alt={user.first_name} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />}
            <Typography variant="h6">{user.first_name} {user.last_name || ''}</Typography>
            {user.username && <Typography variant="subtitle1">@{user.username}</Typography>}
            <Typography variant="body2">ID: {user.id}</Typography>
            <Typography variant="body2">Date: {new Date(user.auth_date * 1000).toDateString()}</Typography>
            <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleLogout}>Logout</Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
