import {
    Autocomplete, Backdrop, Box, Button, Chip, CircularProgress, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EastIcon from '@mui/icons-material/East';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import useHistoricoEscala from './hooks/useHistoricoEscala';
import useModalBlocoHook from '../../Cadastros/Blocos/hooks/useModalBlocoHook';
import TabelaHistorico from './components/TabelaHistorico';
import PainelAfastados from '../../Escalas/components/PainelAfastados';
import PainelDeficiencias from '../../Escalas/components/PainelDeficiencias';
import { formatarDataHora } from '../../../../../../utils/formatarDataHora';

const formatarData = (data) => {
    const s = String(data).substring(0, 10);
    const [ano, mes, dia] = s.split('-');
    return `${dia}/${mes}/${ano}`;
};

export default function HistoricoEscala() {
    const {
        historico,
        escalaSelecionada,
        dadosEscala,
        deficiencias,
        afastados,
        loading,
        loadingDetalhe,
        selecionarEscala,
        filtrarPorBloco,
        voltarParaLista,
    } = useHistoricoEscala();

    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        getAllBlocos();
    }, []);

    return (
        <>
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading || loadingDetalhe}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography sx={{
                fontSize: '24px', color: '#222059', fontWeight: 'bold',
                textAlign: 'center', mb: 2, mt: 1
            }}>
                Histórico de Escalas
            </Typography>

            {!escalaSelecionada ? (
                <Paper sx={{ p: 2, border: '2px solid #50b5ae' }}>
                    <Typography sx={{ color: '#50b5ae', fontWeight: 'bold', mb: 2 }}>
                        Escalas geradas
                    </Typography>

                    {historico.length === 0 && !loading ? (
                        <Typography sx={{ color: '#888', textAlign: 'center', py: 4 }}>
                            Nenhuma escala encontrada.
                        </Typography>
                    ) : (
                        <>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Período</b></TableCell>
                                            <TableCell><b>Gerada em</b></TableCell>
                                            <TableCell><b>Gerada por</b></TableCell>
                                            <TableCell align="center"><b>Status</b></TableCell>
                                            <TableCell align="center"><b>Ações</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historico
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map(escala => (
                                                <TableRow key={escala.id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {formatarData(escala.inicio)}
                                                            <EastIcon sx={{ fontSize: 16, color: '#888' }} />
                                                            {formatarData(escala.fim)}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatarDataHora(escala.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {escala.gerado_por_nome ?? '—'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={escala.status === 'ativa' ? 'Ativa' : 'Inativa'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: escala.status === 'ativa' ? '#e6f9f0' : '#f5f5f5',
                                                                color: escala.status === 'ativa' ? '#1a7a4a' : '#888',
                                                                fontWeight: 'bold',
                                                                border: `1px solid ${escala.status === 'ativa' ? '#1a7a4a' : '#ccc'}`,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            size="small"
                                                            onClick={() => selecionarEscala(escala)}
                                                            sx={{
                                                                bgcolor: '#1b1464', color: '#fff',
                                                                px: 2, py: 0.75,
                                                                textTransform: 'none',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': { transform: 'translateY(-2px)' }
                                                            }}
                                                            endIcon={<HistoryIcon />}
                                                        >
                                                            Visualizar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={historico.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelRowsPerPage="Linhas por página:"
                                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                            />
                        </>
                    )}
                </Paper>
            ) : (
                <>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={voltarParaLista}
                        sx={{ color: '#1b1464', mb: 2 }}
                    >
                        Voltar ao histórico
                    </Button>

                    <Paper sx={{ p: 2, border: '1px solid #ccc', mb: 2 }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#222059' }}>
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                Período: {formatarData(escalaSelecionada.inicio)}
                                <EastIcon sx={{ fontSize: 16, color: '#888' }} />
                                {formatarData(escalaSelecionada.fim)}
                            </Box>
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: 13 }}>
                            Gerada em {formatarDataHora(escalaSelecionada.created_at)}
                        </Typography>
                    </Paper>

                    <form onSubmit={(e) => filtrarPorBloco(e, allBlocos)}>
                        <Grid container spacing={2} sx={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', pb: 2
                        }}>
                            <Grid size={{ md: 4, xs: 8 }}>
                                <Autocomplete
                                    options={allBlocos}
                                    getOptionLabel={(option) => option.nome}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Filtre pelo bloco" required name="bloco" />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ md: 2, xs: 4 }} sx={{ display: 'flex', justifyContent: 'start' }}>
                                <Button type="submit"
                                    sx={{
                                        bgcolor: '#1b1464', color: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { transform: 'translateY(-3px)' }
                                    }}
                                    endIcon={<SearchIcon />}
                                >
                                    Filtrar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    {dadosEscala.length > 0 && (
                        <>
                            <TabelaHistorico
                                dadosEscala={dadosEscala}
                                deficiencias={deficiencias}
                                inicio={escalaSelecionada.inicio}
                                fim={escalaSelecionada.fim}
                            />
                            <PainelDeficiencias deficiencias={deficiencias} />
                            <PainelAfastados afastados={afastados} />
                        </>
                    )}
                </>
            )}
        </>
    );
}
