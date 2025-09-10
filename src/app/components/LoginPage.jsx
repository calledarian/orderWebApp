"use client";

import React, { useEffect, useState } from "react";
import { Paper, Typography, Avatar, Grid, Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage({ setUserId }) {
    const [user, setUser] = useState(null);
    const [widgetLoaded, setWidgetLoaded] = useState(false);

    useEffect(() => {
        // Load user from localStorage
        const storedUser = localStorage.getItem("telegramUser");
        if (storedUser) {
            const tgUser = JSON.parse(storedUser);
            setUser(tgUser);
            setUserId(tgUser.id);
        }

        // Telegram auth callback
        window.onTelegramAuth = (tgUser) => {
            setUser(tgUser);
            setUserId(tgUser.id);
            localStorage.setItem("telegramUser", JSON.stringify(tgUser));
        };

        // Load Telegram widget script only once
        if (!document.getElementById("telegram-login-script")) {
            const script = document.createElement("script");
            script.id = "telegram-login-script";
            script.src = "https://telegram.org/js/telegram-widget.js";
            script.async = true;
            script.setAttribute("data-telegram-login", "musteri_temsilcisi_bot"); // your bot username
            script.setAttribute("data-size", "large");
            script.setAttribute("data-onauth", "onTelegramAuth");
            script.setAttribute("data-request-access", "write");
            script.onload = () => setWidgetLoaded(true);
            document.getElementById("telegram-login-container").appendChild(script);
        } else {
            setWidgetLoaded(true);
        }
    }, [setUserId]);

    if (!user) {
        return (
            <Box
                className="d-flex justify-content-center align-items-center vh-100"
                flexDirection="column"
            >
                <Typography variant="h5" gutterBottom>
                    Login with Telegram
                </Typography>
                <div
                    id="telegram-login-container"
                    className="d-flex justify-content-center"
                ></div>
                {!widgetLoaded && (
                    <Typography variant="body2" color="textSecondary" className="mt-2">
                        Loading Telegram widget...
                    </Typography>
                )}
            </Box>
        );
    }

    // Profile view
    return (
        <Box className="d-flex justify-content-center align-items-center vh-100">
            <Grid container spacing={3} justifyContent="center" maxWidth={600}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Your Profile
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} className="p-3 text-center">
                        <Typography variant="subtitle1">User ID</Typography>
                        <Typography variant="body1">{user.id}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} className="p-3 text-center">
                        <Typography variant="subtitle1">First Name</Typography>
                        <Typography variant="body1">{user.first_name}</Typography>
                    </Paper>
                </Grid>

                {user.last_name && (
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} className="p-3 text-center">
                            <Typography variant="subtitle1">Last Name</Typography>
                            <Typography variant="body1">{user.last_name}</Typography>
                        </Paper>
                    </Grid>
                )}

                {user.username && (
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} className="p-3 text-center">
                            <Typography variant="subtitle1">Username</Typography>
                            <Typography variant="body1">@{user.username}</Typography>
                        </Paper>
                    </Grid>
                )}

                {user.photo_url && (
                    <Grid item xs={12}>
                        <Paper elevation={3} className="p-3 text-center">
                            <Typography variant="subtitle1" gutterBottom>
                                Profile Photo
                            </Typography>
                            <Avatar
                                alt="Profile"
                                src={user.photo_url}
                                sx={{ width: 100, height: 100, margin: "0 auto" }}
                            />
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
