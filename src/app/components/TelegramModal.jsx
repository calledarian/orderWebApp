import React from "react";
import { Box, Modal, Typography, Paper } from "@mui/material";
import TelegramLogin from "./TelegramLogin";

const TelegramLoginModal = ({ userId, setUserId }) => {
    return (
        <Modal
            open={!userId}
            aria-labelledby="telegram-login-title"
            aria-describedby="telegram-login-description"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            hideBackdrop={false}
            closeAfterTransition
        >
            <Paper
                elevation={12}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    width: { xs: "90%", sm: 400 },
                    maxWidth: 500,
                    textAlign: "center",
                }}
            >
                <Typography
                    id="telegram-login-title"
                    variant="h5"
                    component="h2"
                    gutterBottom
                >
                    Login with Telegram
                </Typography>

                <Typography
                    id="telegram-login-description"
                    variant="body2"
                    color="textSecondary"
                    mb={3}
                >
                    Please log in to continue ordering
                </Typography>

                <Box display="flex" justifyContent="center">
                    <TelegramLogin setUserId={setUserId} />
                </Box>
            </Paper>
        </Modal>
    );
};

export default TelegramLoginModal;
