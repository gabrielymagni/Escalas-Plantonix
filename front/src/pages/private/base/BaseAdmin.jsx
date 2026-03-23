import CssBaseline from "@mui/material/CssBaseline"
import Box from '@mui/material/Box';
import { Header } from "./components/Header";
import { SideBar } from "./components/SideBar";
import useAdminBase from "./hooks/useAdminBase";
import { Outlet } from "react-router-dom";


function BaseAdmin() {

    const { openSideBar, handleDrawer } = useAdminBase();

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline />

            <Header open={openSideBar} handleDrawer={handleDrawer} />

            <SideBar openSideBar={openSideBar} handleDrawer={handleDrawer} />

            <Box sx={{width: '100%', overflowX: 'hidden', minHeight: '100vh', p: { md: 10, xs: 1 }, bgcolor: '#f8f7fa'}}>
                <Outlet />
            </Box>

        </Box>
    )
}

export default BaseAdmin
