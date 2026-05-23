import {
    Box, Button, Grid, MenuItem, Paper, Select, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Typography
} from "@mui/material"
import { useMemo } from "react";
import { formatarPeriodo, gerarPeriodo16a15 } from "../../../../../../../utils/gerarPeriodoEscala";
import ButtonsPrevNext from "./ButtonsPrevNext";
import useGerarEscala, { OpcoesEventos } from "../hooks/useGerarEscala";
import useControlarEscala from "../hooks/useControlarEscala";
import { formatarDia } from "../../../../../../../utils/formataDataDiaMesAno";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ORDEM_TURNOS = ['M', 'MT', 'T', 'N'];
const LABEL_TURNOS = { M: 'Manhã', MT: 'Manhã e Tarde', T: 'Tarde', N: 'Noite' };

const getTurnoPrincipal = (prof) => {
    const contagem = {};
    prof.dias.forEach(d => {
        if (d.turno && d.turno !== 'F') {
            contagem[d.turno] = (contagem[d.turno] || 0) + 1;
        }
    });
    if (Object.keys(contagem).length === 0) return 'N';
    return Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
};

const TabelaEscala = ({ dadosEscala, handleChange, submitSalvar, mesAtual, proximoMes, mesAnterior }) => {

    const { getTurno } = useGerarEscala();
    const { buttonEditar, liberaEditar } = useControlarEscala()
    const hoje = new Date().toISOString().slice(0, 10);

    const { inicio, diasNoPeriodo } = useMemo(() =>
        gerarPeriodo16a15(mesAtual),
        [mesAtual]);

    const dadosAgrupados = useMemo(() => {
        const grupos = {};
        [...dadosEscala]
            .sort((a, b) => {
                const ia = ORDEM_TURNOS.indexOf(getTurnoPrincipal(a));
                const ib = ORDEM_TURNOS.indexOf(getTurnoPrincipal(b));
                return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
            })
            .forEach(prof => {
                const turno = getTurnoPrincipal(prof);
                if (!grupos[turno]) grupos[turno] = [];
                grupos[turno].push(prof);
            });
        return grupos;
    }, [dadosEscala]);

    const renderDiasHeader = () => {
        return Array.from({ length: diasNoPeriodo }, (_, i) => {
            const data = new Date(inicio);
            data.setDate(inicio.getDate() + i);

            const dataFormatada = data.toISOString().slice(0, 10);
            const ehHoje = dataFormatada === hoje;

            return (
                <TableCell
                    key={i} align="center"
                    sx={{
                        border: '1px solid #50b5ae', p: 0.7,
                        backgroundColor: ehHoje ? '#e3f2fd' : 'transparent',
                        fontWeight: ehHoje ? 'bold' : 'normal',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <strong>{formatarDia(data)}</strong>
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
                        backgroundColor: ehHoje ? "#e3f2fd" : "transparent",
                        fontWeight: ehHoje ? "bold" : "normal"
                    }}>
                    {getTurno(profissional, dataFormatada) ? (
                        <Select size="small" variant="standard" disableUnderline
                            disabled={buttonEditar}
                            value={getTurno(profissional, dataFormatada)}
                            onChange={(e) =>
                                handleChange(profissional.id, dataFormatada, e.target.value)
                            }
                            sx={{
                                color: "#000", borderRadius: 2, p: 0.5,
                                bgcolor: background(getTurno(profissional, dataFormatada))
                            }}
                        >
                            {OpcoesEventos.map(op => (
                                <MenuItem key={op.id} value={op.id}>
                                    {op.id}
                                </MenuItem>
                            ))}
                        </Select>
                    ) : (
                        <>-</>
                    )}
                </TableCell>
            );
        });
    };

    return (
        <Paper sx={{ p: 2, border: '2px solid #50b5ae' }}>
            <Typography sx={{
                fontSize: '15px', color: buttonEditar ? '#000' : '#b61b1b',
                textAlign: 'start',
            }}>
                * Tabela em modo de {buttonEditar ? 'visualização' : 'edição'}
            </Typography>

            <ButtonsPrevNext
                handleNext={proximoMes}
                handlePrev={mesAnterior}
                periodo={formatarPeriodo(inicio, diasNoPeriodo)}
                liberaEditar={liberaEditar}
            />

            <TableContainer sx={{ mt: 2 }}>
                <Table size="small">

                    <TableHead>
                        <TableRow>
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
                        {ORDEM_TURNOS.filter(t => dadosAgrupados[t]?.length > 0).map(turno => (
                            <>
                                <TableRow key={`header-${turno}`}>
                                    <TableCell
                                        colSpan={diasNoPeriodo + 1}
                                        sx={{
                                            bgcolor: backgroundTurno(turno),
                                            border: '1px solid #50b5ae',
                                            fontWeight: 'bold',
                                            fontSize: 13,
                                            p: 0.6,
                                            position: 'sticky',
                                            left: 0,
                                        }}
                                    >
                                        🕐 {LABEL_TURNOS[turno]}
                                    </TableCell>
                                </TableRow>
                                {dadosAgrupados[turno].map((prof) => (
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
                            </>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {!buttonEditar &&
                <Grid container spacing={2} sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3
                }}>
                    <Grid size={{ md: 6, xs: 12 }} sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Button onClick={submitSalvar}
                            sx={{
                                bgcolor: '#258119', color: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }} endIcon={<CheckCircleIcon />}>
                            Salvar alterações
                        </Button>
                    </Grid>
                </Grid>
            }

        </Paper>
    )
}

export default TabelaEscala


const background = (texto) => {
    if (texto === 'MT') return '#a2ff9a';
    if (texto === 'M') return '#f4ff95';
    if (texto === 'T') return '#ffbf8b';
    if (texto === 'N') return '#bae0ff';
    if (texto === 'F') return '#b8b8b8';
}

const backgroundTurno = (turno) => {
    if (turno === 'M') return '#faffc0';
    if (turno === 'MT') return '#d4ffcf';
    if (turno === 'T') return '#ffe8cc';
    if (turno === 'N') return '#d6edff';
    return '#eeeeee';
}
