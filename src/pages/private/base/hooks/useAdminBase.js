import { useMediaQuery, useTheme } from "@mui/material";
import { useState } from 'react';

const useAdminBase = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openSideBar, setOpenSideBar] = useState(!isMobile ? true : false);

    const handleDrawer = () => {
        setOpenSideBar((prev) => !prev)
    }

    return {
        openSideBar, isMobile, handleDrawer
    }
}

export default useAdminBase
