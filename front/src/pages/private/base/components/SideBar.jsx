import Divider from "@mui/material/Divider";
import { Drawer, DrawerHeader } from "./styleDrawer";
import IconButton from "@mui/material/IconButton";
import { RoutesSidebar } from "./RotasSideBar.jsx";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useAdminBase from "../hooks/useAdminBase.js";
import { Link, useLocation } from "react-router-dom";

export function SideBar({ openSideBar, handleDrawer }) {

    const { isMobile } = useAdminBase();

    const location = useLocation();
    const pathMatch = RoutesSidebar.find(item => item.path === location.pathname);

    return (
        <Drawer open={openSideBar} variant={(isMobile && !openSideBar) ? "temporary" : "permanent"} >
            <DrawerHeader>
                <IconButton onClick={handleDrawer} >
                    <ChevronLeftIcon sx={{ color: '#787878' }} />
                </IconButton>
            </DrawerHeader>
            <Divider />

            <List >
                {RoutesSidebar.map(item => (
                    <ListItem key={item.path} disablePadding sx={{ display: "block" }} title={item.name}>
                        {item.divider &&
                            <Divider sx={{ fontSize: 14, color: '#000000' }}>
                                {openSideBar ? item.text_divider : null}
                            </Divider>
                        }
                        <ListItemButton
                            sx={sxItenButton(openSideBar, pathMatch?.path === item.path)} component={Link}
                            to={item.path}
                        >
                            <ListItemIcon
                                sx={sxItemIcon(openSideBar, pathMatch?.path === item.path)}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                sx={sxItemText(openSideBar, pathMatch?.path === item.path)}
                            />
                        </ListItemButton>

                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}

export const sxItenButton = (open, isSelected) => ({
    minHeight: 40,
    justifyContent: open ? 'initial' : 'center',
    bgcolor: isSelected ? "#141259" : "transparent", //cor teste
    "&:hover": {
        bgcolor: isSelected ? "#141259" : "rgba(0, 0, 0, 0.08)"
    },
    borderRadius: "10px",
    m: 1,
})

export const sxItemIcon = (open, isSelected) => ({
    minWidth: 0,
    justifyContent: "center",
    color: isSelected ? "#fff" : "#707070",
    mr: open ? 3 : 'auto',
})

export const sxItemText = (open, isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    color: isSelected ? "#fff" : "#000",
    opacity: open ? 1 : 0
})