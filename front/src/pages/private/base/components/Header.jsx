import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import logo from '../../../../img/logo.webp';
import Box from '@mui/material/Box';
import { AppBar } from './styleDrawer';
import NotificacaoSino from './NotificacaoSino';

export function Header({ open, handleDrawer }) {

    return (
        <AppBar position="fixed" open={open} sx={{ bgcolor: '#fff' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton edge="start" aria-label="menu" color="#1b1464"
                        sx={[{ marginRight: 5 }, open && { display: 'none' }]}
                        title='Menu'
                        onClick={handleDrawer}
                    >
                        <MenuIcon sx={{ color: '#0452A2' }} />
                    </IconButton>

                    <Box align="center" sx={{
                        width: '180px',
                        height: '50px',
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }} />
                </Box>

                <NotificacaoSino />
            </Toolbar>
        </AppBar>
    )
}