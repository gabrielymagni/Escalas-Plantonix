import {
    Autocomplete, Backdrop, Button, CircularProgress, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography
} from '@mui/material';
import { useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import useHistoricoEscala from './hooks/useHistoricoEscala';
import useModalBlocoHook from '../../Cadastros/Blocos/hooks/useModalBlocoHook';
import TabelaHistorico from './components/TabelaHistorico';

const formatarData = (data) => {
    const s = String(data).substring(0, 10);
    const [ano, mes, dia] = s.split('-');
    return `${dia}/${mes}/${ano}`;
};

const formatarDataHora = (data) => {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
};

export default function HistoricoEscala() {
    const {
        historico,
        escalaSelecionada,
        dadosEscala,
        loading,
        loadingDetalhe,
        selecionarEscala,
        filtrarPorBloco,
        voltarParaLista,
    } = useHistoricoEscala();

    const { allBlocos, getAllBlocos } = useModalBlocoHook();

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
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Período</b></TableCell>
                                        <TableCell><b>Gerada em</b></TableCell>
                                        <TableCell align="center"><b>Ações</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {historico.map(escala => (
                                        <TableRow key={escala.id} hover>
                                            <TableCell>
                                                {formatarData(escala.inicio)} → {formatarData(escala.fim)}
                                            </TableCell>
                                            <TableCell>
                                                {formatarDataHora(escala.created_at)}
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
                            Período: {formatarData(escalaSelecionada.inicio)} → {formatarData(escalaSelecionada.fim)}
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
                        <TabelaHistorico
                            dadosEscala={dadosEscala}
                            inicio={escalaSelecionada.inicio}
                            fim={escalaSelecionada.fim}
                        />
                    )}
                </>
            )}
        </>
    );
}
