import { useState, useEffect, useCallback } from 'react';
import {
    Badge, Box, Divider, IconButton, List, ListItem, ListItemText,
    Popover, Tooltip, Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import api from '../../../../services/api';

const NotificacaoSino = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificacoes, setNotificacoes] = useState([]);

    const fetchNotificacoes = useCallback(async () => {
        try {
            const response = await api.get('/notificacoes');
            if (response.status === 200) setNotificacoes(response.data);
        } catch {
            // silencioso — sem interromper o fluxo do usuário
        }
    }, []);

    useEffect(() => {
        fetchNotificacoes();
    }, [fetchNotificacoes]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        fetchNotificacoes();
    };

    const handleClose = () => setAnchorEl(null);

    const handleMarcarLida = async (id) => {
        try {
            await api.put(`/notificacoes/${id}/lida`);
            setNotificacoes(prev => prev.filter(n => n.id !== id));
        } catch {
            // silencioso
        }
    };

    const naoLidas = notificacoes.length;

    return (
        <>
            <Tooltip title="Notificações">
                <IconButton onClick={handleOpen} sx={{ color: '#0452A2' }}>
                    <Badge badgeContent={naoLidas} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Box sx={{ width: 360, maxHeight: 420, overflow: 'auto' }}>
                    <Typography sx={{ px: 2, py: 1.5, fontWeight: 'bold', color: '#222059', fontSize: 14 }}>
                        Notificações {naoLidas > 0 && `(${naoLidas})`}
                    </Typography>
                    <Divider />

                    {notificacoes.length === 0 ? (
                        <Typography sx={{ px: 2, py: 2, color: '#999', fontSize: 13 }}>
                            Nenhuma notificação pendente.
                        </Typography>
                    ) : (
                        <List dense disablePadding>
                            {notificacoes.map((n) => (
                                <ListItem key={n.id} divider alignItems="flex-start"
                                    secondaryAction={
                                        <Typography
                                            variant="caption"
                                            sx={{ cursor: 'pointer', color: '#0452A2', whiteSpace: 'nowrap' }}
                                            onClick={() => handleMarcarLida(n.id)}
                                        >
                                            Marcar lida
                                        </Typography>
                                    }
                                >
                                    <ListItemText
                                        primary={n.mensagem}
                                        primaryTypographyProps={{ fontSize: 12, pr: 8 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default NotificacaoSino;
