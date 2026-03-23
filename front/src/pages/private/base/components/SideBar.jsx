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
import { useLocation } from "react-router-dom";

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
                            <Divider sx={{ fontSize: 12, color: '#4F4F4F' }}>
                                {open ? item.text_divider : null}
                            </Divider>
                        }
                        <ListItemButton
                            sx={{
                                ...sxItenButton(open, pathMatch?.path === item.path),
                                borderRadius: "10px",
                                m: 1,
                            }}
                            // component={Link}
                            to={item.path}
                        >
                            <ListItemIcon
                                sx={sxItemIcon(open, pathMatch?.path === item.path)}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                sx={sxItemText(open, pathMatch?.path === item.path)}
                            />
                        </ListItemButton>

                        {/* {item.divider &&
                            <Divider sx={{ fontSize: 12, color: "#787878" }} />
                        } */}
                    </ListItem>
                ))}

                {/* <ListItem disablePadding sx={{ display: 'block', }}>
                    <ListItemButton sx={sxItenButton} onClick={() => handleDeslogar()}>
                        <ListItemIcon sx={sxItemIcon}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Sair'} sx={sxItemText} />
                    </ListItemButton>
                </ListItem> */}
            </List>


        </Drawer>
    )
}

export const sxItenButton = (open, isSelected) => ({
    minHeight: 48,
    justifyContent: open ? 'initial' : 'center',
    bgcolor: isSelected ? "#e3eefa" : "transparent", //cor teste
    "&:hover": {
        bgcolor: isSelected ? "#e3eefa" : "rgba(0, 0, 0, 0.08)"
    },
})

export const sxItemIcon = (open, isSelected) => ({
    minWidth: 0,
    justifyContent: "center",
    color: isSelected ? "#1565c0" : "#707070",
    mr: open ? 3 : 'auto',
})

export const sxItemText = (open, isSelected) => ({
    fontWeight: isSelected ? "bold" : "normal",
    color: isSelected ? "#1565c0" : "#000",
    opacity: open ? 1 : 0
})