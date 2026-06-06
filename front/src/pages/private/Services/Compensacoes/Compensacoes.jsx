import {
    Backdrop, Box, Button, Chip, CircularProgress, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import useCompensacoes from './hooks/useCompensacoes';
import { formatarDataHora } from '../../../../../utils/formatarDataHora';

export default function Compensacoes() {
    const {
        compensacoes,
        loading,
        filtroStatus,
        fetchCompensacoes,
        resolverCompensacao,
        handleFiltro,
    } = useCompensacoes();

    useEffect(() => {
        fetchCompensacoes();
    }, []);

    return (
        <>
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography sx={{ fontSize: '24px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2, mt: 1 }}>
                Compensações
            </Typography>

            <Paper sx={{ p: 2, border: '2px solid #50b5ae' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ color: '#50b5ae', fontWeight: 'bold' }}>
                        Folgas pendentes 
                    </Typography>

                    <ToggleButtonGroup
                        value={filtroStatus}
                        exclusive
                        onChange={(_, val) => val && handleFiltro(val)}
                        size="small"
                    >
                        <ToggleButton value="pendente" sx={{ textTransform: 'none', fontSize: 12 }}>
                            Pendentes
                        </ToggleButton>
                        <ToggleButton value="resolvida" sx={{ textTransform: 'none', fontSize: 12 }}>
                            Resolvidas
                        </ToggleButton>
                        <ToggleButton value="todas" sx={{ textTransform: 'none', fontSize: 12 }}>
                            Todas
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {compensacoes.length === 0 && !loading ? (
                    <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>
                        Nenhuma compensação encontrada.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Funcionário</b></TableCell>
                                    <TableCell><b>Cargo</b></TableCell>
                                    <TableCell><b>Tipo</b></TableCell>
                                    <TableCell><b>Motivo</b></TableCell>
                                    <TableCell><b>Gerada em</b></TableCell>
                                    <TableCell align="center"><b>Status</b></TableCell>
                                    <TableCell align="center"><b>Ação</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {compensacoes.map((c) => (
                                    <TableRow key={c.id} hover>
                                        <TableCell>{c.funcionario?.nome ?? '—'}</TableCell>
                                        <TableCell>{c.funcionario?.cargo ?? '—'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Folga"
                                                size="small"
                                                icon={<EventAvailableIcon sx={{ fontSize: 14 }} />}
                                                sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold', border: '1px solid #1565c0' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12, color: '#555' }}>{c.motivo ?? '—'}</TableCell>
                                        <TableCell>{formatarDataHora(c.created_at)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={c.status === 'pendente' ? 'Pendente' : 'Resolvida'}
                                                size="small"
                                                sx={{
                                                    bgcolor: c.status === 'pendente' ? '#fff8e1' : '#e6f9f0',
                                                    color: c.status === 'pendente' ? '#e65100' : '#1a7a4a',
                                                    fontWeight: 'bold',
                                                    border: `1px solid ${c.status === 'pendente' ? '#e65100' : '#1a7a4a'}`,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {c.status === 'pendente' && (
                                                <Button
                                                    size="small"
                                                    onClick={() => resolverCompensacao(c.id)}
                                                    sx={{
                                                        bgcolor: '#258119', color: '#fff',
                                                        textTransform: 'none',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': { transform: 'translateY(-2px)' }
                                                    }}
                                                    endIcon={<CheckCircleIcon />}
                                                >
                                                    Resolver
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </>
    );
}
