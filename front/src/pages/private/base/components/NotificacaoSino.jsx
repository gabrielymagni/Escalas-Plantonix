import { useState, useEffect, useCallback } from 'react';
import {
    Badge, Box, Button, Chip, Divider, IconButton,
    List, ListItem, Popover, Tab, Tabs, Tooltip, Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import api from '../../../../services/api';
import { useNavigate } from 'react-router-dom';

const acoesPorTipo = {
    afastamento: [
        { label: 'Ver funcionário', path: '/private/cadastroFuncionario', icon: <PersonSearchIcon sx={{ fontSize: 14 }} /> },
        { label: 'Ajustar escala', path: '/private/gerarEscala', icon: <CalendarMonthIcon sx={{ fontSize: 14 }} /> },
    ],
    compensacao: [
        { label: 'Ver compensações', path: '/private/compensacoes', icon: <EventAvailableIcon sx={{ fontSize: 14 }} /> },
    ],
};

const corPorTipo = {
    afastamento: '#e67e00',
    compensacao: '#1565c0',
};

const labelPorTipo = {
    afastamento: 'Afastamento',
    compensacao: 'Compensação',
};

const ItemNotificacao = ({ n, onMarcarLida, onAcao, lida = false }) => {
    const acoes = acoesPorTipo[n.tipo] ?? [];
    const cor = corPorTipo[n.tipo] ?? '#1b1464';
    const label = labelPorTipo[n.tipo] ?? n.tipo;

    return (
        <ListItem divider alignItems="flex-start"
            sx={{ flexDirection: 'column', gap: 1, py: 1.5, opacity: lida ? 0.6 : 1 }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Chip
                    label={label}
                    size="small"
                    sx={{ bgcolor: cor, color: '#fff', fontWeight: 'bold', fontSize: 10 }}
                />
                <Typography sx={{ fontSize: 11, color: '#888', ml: 'auto' }}>
                    {new Date(n.created_at).toLocaleDateString('pt-BR')}
                </Typography>
            </Box>

            <Typography sx={{ fontSize: 12, color: '#333', lineHeight: 1.5 }}>
                {n.mensagem}
            </Typography>

            {!lida && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%' }}>
                    {acoes.map((acao) => (
                        <Button
                            key={acao.path}
                            size="small"
                            variant="outlined"
                            startIcon={acao.icon}
                            onClick={() => onAcao(acao.path, n.id)}
                            sx={{
                                fontSize: 11,
                                borderColor: cor,
                                color: cor,
                                '&:hover': { borderColor: cor, bgcolor: `${cor}15` }
                            }}
                        >
                            {acao.label}
                        </Button>
                    ))}

                    <Button
                        size="small"
                        variant="text"
                        startIcon={<CheckIcon sx={{ fontSize: 14 }} />}
                        onClick={() => onMarcarLida(n.id)}
                        sx={{ fontSize: 11, color: '#999', ml: 'auto' }}
                    >
                        Marcar lida
                    </Button>
                </Box>
            )}
        </ListItem>
    );
};

const NotificacaoSino = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [tab, setTab] = useState(0);
    const [pendentes, setPendentes] = useState([]);
    const [lidas, setLidas] = useState([]);
    const [loadingLidas, setLoadingLidas] = useState(false);
    const navigate = useNavigate();

    const fetchPendentes = useCallback(async () => {
        try {
            const response = await api.get('/notificacoes');
            if (response.status === 200) setPendentes(response.data);
        } catch {
            // silencioso
        }
    }, []);

    const fetchLidas = useCallback(async () => {
        setLoadingLidas(true);
        try {
            const response = await api.get('/notificacoes/lidas');
            if (response.status === 200) setLidas(response.data);
        } catch {
            // silencioso
        } finally {
            setLoadingLidas(false);
        }
    }, []);

    useEffect(() => {
        fetchPendentes();
        const intervalo = setInterval(fetchPendentes, 30_000);
        return () => clearInterval(intervalo);
    }, [fetchPendentes]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        fetchPendentes();
    };

    const handleClose = () => {
        setAnchorEl(null);
        setTab(0);
    };

    const handleTabChange = (_, newTab) => {
        setTab(newTab);
        if (newTab === 1) fetchLidas();
    };

    const handleMarcarLida = async (id) => {
        try {
            await api.put(`/notificacoes/${id}/lida`);
            const notif = pendentes.find(n => n.id === id);
            setPendentes(prev => prev.filter(n => n.id !== id));
            if (notif) setLidas(prev => [notif, ...prev]);
        } catch {
            // silencioso
        }
    };

    const handleAcao = async (path, notificacaoId) => {
        await handleMarcarLida(notificacaoId);
        handleClose();
        navigate(path);
    };

    return (
        <>
            <Tooltip title="Notificações">
                <IconButton onClick={handleOpen} sx={{ color: '#0452A2' }}>
                    <Badge badgeContent={pendentes.length} color="error">
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
                <Box sx={{ width: 400, maxHeight: 520, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ px: 2, pt: 1.5, fontWeight: 'bold', color: '#222059', fontSize: 14 }}>
                        Notificações
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        sx={{ px: 1, minHeight: 36 }}
                        TabIndicatorProps={{ style: { backgroundColor: '#1b1464' } }}
                    >
                        <Tab
                            label={`Pendentes${pendentes.length > 0 ? ` (${pendentes.length})` : ''}`}
                            sx={{ fontSize: 12, minHeight: 36, color: tab === 0 ? '#1b1464' : undefined }}
                        />
                        <Tab
                            label="Lidas"
                            sx={{ fontSize: 12, minHeight: 36, color: tab === 1 ? '#1b1464' : undefined }}
                        />
                    </Tabs>

                    <Divider />

                    <Box sx={{ overflow: 'auto', flex: 1 }}>
                        {tab === 0 && (
                            pendentes.length === 0
                                ? <Typography sx={{ px: 2, py: 2, color: '#999', fontSize: 13 }}>Nenhuma notificação pendente.</Typography>
                                : <List dense disablePadding>
                                    {pendentes.map(n => (
                                        <ItemNotificacao key={n.id} n={n} onMarcarLida={handleMarcarLida} onAcao={handleAcao} />
                                    ))}
                                </List>
                        )}

                        {tab === 1 && (
                            loadingLidas
                                ? <Typography sx={{ px: 2, py: 2, color: '#999', fontSize: 13 }}>Carregando...</Typography>
                                : lidas.length === 0
                                    ? <Typography sx={{ px: 2, py: 2, color: '#999', fontSize: 13 }}>Nenhuma notificação lida.</Typography>
                                    : <List dense disablePadding>
                                        {lidas.map(n => (
                                            <ItemNotificacao key={n.id} n={n} onMarcarLida={handleMarcarLida} onAcao={handleAcao} lida />
                                        ))}
                                    </List>
                        )}
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default NotificacaoSino;
