import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function LabelBottomNavigation({ currentPage, setCurrentPage }) {
    const handleChange = (event, newValue) => {
        setCurrentPage(newValue);
    };

    return (
        <BottomNavigation
            sx={{
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)", // centers it on desktop
            }}
            value={currentPage} // bind to parent state
            onChange={handleChange}
        >
            <BottomNavigationAction label="Menu" value="menu" icon={<RestaurantMenuIcon />} />
            <BottomNavigationAction label="Location" value="branches" icon={<LocationOnIcon />} />
        </BottomNavigation>
    );
}
