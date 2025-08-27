import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

export default function Category({ activeCategory, setActiveCategory }) {
    const handleChange = (event, newValue) => {
        setActiveCategory(newValue);
    };
    const menuCategories = ["All", "Shawarma", "Burgers", "Pizza", "Drinks"];


    return (
        <Box sx={{
            borderBottom: 1,
            borderColor: "divider",
            overflowX: "auto",
            mb: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center"
        }}>
            <Tabs
                value={activeCategory}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="inherit" // ensures inactive tabs are gray instead of blue
                indicatorColor="primary" // active tab underline (you can keep or change)
            >
                {menuCategories.map((category, index) => (
                    <Tab
                        key={category + index}
                        label={category}
                        value={category}
                        sx={{
                            textTransform: "none",
                            fontWeight: activeCategory === category ? "bold" : "normal",
                            minWidth: 100,
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.04)",
                            },
                        }}

                    />
                ))}
            </Tabs>
        </Box>
    );
}
