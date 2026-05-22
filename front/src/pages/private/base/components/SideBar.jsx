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
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Box from "@mui/material/Box";
import useAdminBase from "../hooks/useAdminBase.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../../../services/api";
import { toast } from "sonner";

export function SideBar({ openSideBar, handleDrawer }) {

    const { isMobile } = useAdminBase();
    const location = useLocation();
    const navigate = useNavigate();
    const pathMatch = RoutesSidebar.find(item => item.path === location.pathname);

    const isLoggedIn = !!localStorage.getItem('access_token');

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // ignora erro de rede — limpa sessão de qualquer forma
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('funcionario');
            toast.success('Sessão encerrada.', {
                style: { background: '#141259', color: 'white' }
            });
            navigate('/login');
        }
    };

    return (
        <Drawer
            open={openSideBar}
            variant={(isMobile && !openSideBar) ? "temporary" : "permanent"}
            sx={{ '& .MuiDrawer-paper': { display: 'flex', flexDirection: 'column' } }}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawer} >
                    <ChevronLeftIcon sx={{ color: '#787878' }} />
                </IconButton>
            </DrawerHeader>
            <Divider />

            <List>
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

            {/* Rodapé da sidebar */}
            <Box sx={{ mt: 'auto' }}>
                <Divider />
                <List>
                    {isLoggedIn ? (
                        <ListItem disablePadding sx={{ display: 'block' }} title="Sair">
                            <ListItemButton sx={sxItenButton(openSideBar, false)} onClick={handleLogout}>
                                <ListItemIcon sx={sxItemIcon(openSideBar, false)}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sair" sx={sxItemText(openSideBar, false)} />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <ListItem disablePadding sx={{ display: 'block' }} title="Entrar">
                            <ListItemButton sx={sxItenButton(openSideBar, false)} component={Link} to="/login">
                                <ListItemIcon sx={sxItemIcon(openSideBar, false)}>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Entrar" sx={sxItemText(openSideBar, false)} />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Box>
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