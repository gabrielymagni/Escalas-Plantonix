import { useEffect, useState, useMemo } from "react";
import { Autocomplete, Backdrop, Button, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from "@mui/material";
import useGerarEscala, { OpcoesEventos } from "./hooks/useGerarEscala";
import useModalBlocoHook from "../../Cadastros/Blocos/hooks/useModalBlocoHook";
import ButtonsPrevNext from "./components/ButtonsPrevNext";
import { formatarDia, formatarMes } from "../../../../../../utils/formataDataDiaMesAno";
import { formatarPeriodo, gerarPeriodo16a15 } from "../../../../../../utils/gerarPeriodoEscala";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModalGerarEscala from "./components/ModalGerarEscala";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

export default function GerarEscala() {

    const { dadosEscala, mesAtual, proximoMes, mesAnterior, getTurno, handleChange, 
        filtraBloco, loading } = useGerarEscala();
    const { allBlocos, getAllBlocos } = useModalBlocoHook();
    console.log("loading", loading)
    console.log("dadosEscala", dadosEscala)

    const [buttonEditar, setButtonEditar] = useState(true);
    const [open, setOpen] = useState(false);

    const hoje = new Date().toISOString().slice(0, 10);

    const { inicio, diasNoPeriodo } = useMemo(() =>
        gerarPeriodo16a15(mesAtual),
        [mesAtual]);

    useEffect(() => {
        getAllBlocos();
    }, [])

    const liberaEditar = (evento, blocos) => {
        setButtonEditar(false)
    }

    const salvaAlteracao = () => {
        setButtonEditar(true)
    }

    const handleOpen = () => {
        setOpen(prev => !prev);
    }

    //gera dias 
    const renderDiasHeader = () => {
        return Array.from({ length: diasNoPeriodo }, (_, i) => {
            const data = new Date(inicio);
            data.setDate(inicio.getDate() + i);

            const dataFormatada = data.toISOString().slice(0, 10);
            const ehHoje = dataFormatada === hoje;

            return (
                <TableCell
                    key={i} align="center" sx={{
                        border: '1px solid #50b5ae', p: 0.5,
                        backgroundColor: ehHoje
                            ? "#e3f2fd"
                            : "transparent",
                        fontWeight: ehHoje ? "bold" : "normal"
                    }}>
                    <strong> {formatarDia(data)} </strong>
                </TableCell>
            );
        });
    };

    const renderCelulas = (profissional) => {

        return Array.from({ length: diasNoPeriodo }, (_, i) => {

            const data = new Date(inicio);
            data.setDate(inicio.getDate() + i);

            const dataFormatada = data.toISOString().slice(0, 10);
            const ehHoje = dataFormatada === hoje;

            return (
                <TableCell
                    key={i} align="center" sx={{
                        border: '1px solid #50b5ae', p: 0.5,
                        backgroundColor: ehHoje
                            ? "#e3f2fd"
                            : "transparent",
                        fontWeight: ehHoje ? "bold" : "normal"
                    }}>
                    <Select size="small" variant="standard" disableUnderline
                        disabled={buttonEditar}
                        value={getTurno(profissional, dataFormatada)}
                        onChange={(e) =>
                            handleChange(profissional.id, dataFormatada, e.target.value)
                        }
                        sx={{
                            color: "#fff", borderRadius: 2, p: 0.5,
                            bgcolor: background(getTurno(profissional, dataFormatada))
                        }}
                    >
                        {OpcoesEventos.map(op => (
                            <MenuItem key={op.id} value={op.id}>
                                {op.id}
                            </MenuItem>
                        ))}
                    </Select>
                </TableCell>
            );
        });
    };

    return (
        <>

        
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop> 


            <Typography sx={{
                fontSize: '24px', color: '#222059', fontWeight: 'bold',
                textAlign: 'center', mb: 2, mt: 1
            }}>
                Escalas
            </Typography>

            <form onSubmit={(e) => filtraBloco(e, allBlocos)}>
                <Grid container spacing={2} sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2
                }}>
                    <Grid size={{ md: 4, xs: 9 }} >
                        <Autocomplete
                            options={allBlocos}
                            getOptionLabel={(option) => option.nome}
                            renderInput={(params) => (
                                <TextField {...params} label="Filtre pelo bloco" required name="bloco" />
                            )}
                        />
                    </Grid>

                    <Grid size={{ md: 2, xs: 3 }} sx={{ display: 'flex', justifyContent: 'start' }} >
                        <Button type="submit"
                            sx={{
                                bgcolor: '#1b1464', color: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                }
                            }} endIcon={<SearchIcon />}>
                            Filtrar
                        </Button>
                    </Grid>

                    <Grid size={{ md: 6, xs: 12 }} gap={2} sx={{ display: 'flex', justifyContent: 'end' }} >
                        <Button onClick={handleOpen}
                            sx={{
                                bgcolor: '#1b1464', color: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                }
                            }} endIcon={<AddIcon />}>
                            Adicionar
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {(!loading && dadosEscala.length > 0) &&
                <>
                    <Typography sx={{
                        fontSize: '15px', color: buttonEditar ? '#000' : '#b61b1b',
                        textAlign: 'start',
                    }}>
                        * Tabela em modo de {buttonEditar ? 'visualização' : 'edição'}
                    </Typography>

                    <Paper sx={{ p: 2, border: '2px solid #50b5ae' }}>
                        <ButtonsPrevNext
                            handleNext={proximoMes}
                            handlePrev={mesAnterior}
                            periodo={formatarPeriodo(inicio, diasNoPeriodo)}
                            liberaEditar={liberaEditar}
                        />

                        <TableContainer sx={{ mt: 2 }}>
                            <Table size="small">

                                <TableHead>
                                    <TableRow >
                                        <TableCell sx={{
                                            border: '1px solid #50b5ae', p: 0.5,
                                            position: "sticky", left: 0, bgcolor: "#f3f3f3", zIndex: 3
                                        }}>
                                            <b>Profissional</b>
                                        </TableCell>

                                        {renderDiasHeader()}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {dadosEscala.map((prof) => (
                                        <TableRow key={prof.id} sx={{ p: 0 }}>
                                            <TableCell sx={{
                                                border: '1px solid #50b5ae', p: 0.5,
                                                position: "sticky",
                                                left: 0,
                                                bgcolor: "#f3f3f3",
                                                zIndex: 2
                                            }}>
                                                {prof.nome}
                                            </TableCell>

                                            {renderCelulas(prof)}

                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>

                    </Paper>

                    {!buttonEditar &&
                        <Grid container spacing={2} sx={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3
                        }}>

                            <Grid size={{ md: 6, xs: 12 }} sx={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                            }}>
                                <Button onClick={salvaAlteracao}
                                    sx={{
                                        bgcolor: '#258119', color: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                        }
                                    }} endIcon={<CheckCircleIcon />}>
                                    Salvar alterações
                                </Button>
                            </Grid>

                        </Grid>
                    }
                </>
            }

            <ModalGerarEscala open={open} handleOpen={handleOpen} />


        </>
    );
}

const background = (texto) => {
    if (texto === 'MT') return '#a2ff9a';
    if (texto === 'M') return '#f4ff95';
    if (texto === 'T') return '#ffbf8b';
    if (texto === 'N') return '#bae0ff';
    if (texto === 'F') return '#797979';
}




