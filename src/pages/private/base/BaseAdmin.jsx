import CssBaseline from "@mui/material/CssBaseline"
import Box from '@mui/material/Box';
import { Header } from "./components/Header";
import { SideBar } from "./components/SideBar";
import useAdminBase from "./hooks/useAdminBase";
import { DrawerHeader } from "./components/styleDrawer";
import { Outlet, useLocation } from "react-router-dom";
import { RoutesSidebar } from "./components/RotasSideBar";


function BaseAdmin() {

    const { openSideBar, handleDrawer } = useAdminBase();
    const location = useLocation();
    const pathMatch = RoutesSidebar.find(item => item.path === location.pathname);


    return (
        <Box >
            <CssBaseline />

            <Header open={openSideBar} handleDrawer={handleDrawer} />

            <SideBar openSideBar={openSideBar} handleDrawer={handleDrawer} />

            {/* <SideBarBase headerValue={headerValue} open={open} /> */}

            <Box sx={{
                border: '1px solid #fed400',
                width: '100%', overflowX: 'hidden', minHeight: '100vh',
                p: { md: 3, xs: 1 }, bgcolor: '#f8f7fa'
            }}>
                <DrawerHeader />;
                <Outlet />
            </Box>

        </Box>
    )
}

export default BaseAdmin
