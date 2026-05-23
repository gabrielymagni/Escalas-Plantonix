import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography
} from '@mui/material';
import { useMemo } from 'react';
import { formatarDia } from '../../../../../../../utils/formataDataDiaMesAno';

const ORDEM_TURNOS = ['M', 'MT', 'T', 'N'];
const LABEL_TURNOS = { M: 'Manhã', MT: 'Manhã e Tarde', T: 'Tarde', N: 'Noite' };

const backgroundTurno = (turno) => {
    if (turno === 'M') return '#faffc0';
    if (turno === 'MT') return '#d4ffcf';
    if (turno === 'T') return '#ffe8cc';
    if (turno === 'N') return '#d6edff';
    return '#eeeeee';
};

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

const TabelaHistorico = ({ dadosEscala, inicio, fim }) => {
    const hoje = new Date().toISOString().slice(0, 10);

    const dias = useMemo(() => {
        const result = [];
        const [ai, mi, di] = inicio.substring(0, 10).split('-').map(Number);
        const [af, mf, df] = fim.substring(0, 10).split('-').map(Number);
        const start = new Date(ai, mi - 1, di);
        const end = new Date(af, mf - 1, df);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            result.push(`${y}-${m}-${day}`);
        }
        return result;
    }, [inicio, fim]);

    const getTurno = (profissional, data) =>
        profissional.dias.find(d => d.data === data)?.turno || '';

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

    return (
        <Paper sx={{ p: 2, border: '2px solid #50b5ae', mt: 2 }}>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                border: '1px solid #50b5ae', p: 0.5,
                                position: 'sticky', left: 0, bgcolor: '#f3f3f3', zIndex: 3
                            }}>
                                <b>Profissional</b>
                            </TableCell>
                            {dias.map(data => {
                                const ehHoje = data === hoje;
                                return (
                                    <TableCell key={data} align="center" sx={{
                                        border: '1px solid #50b5ae', p: 0.7,
                                        backgroundColor: ehHoje ? '#e3f2fd' : 'transparent',
                                        fontWeight: ehHoje ? 'bold' : 'normal',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        <strong>
                                            {formatarDia(new Date(
                                                ...data.split('-').map((v, i) => i === 1 ? Number(v) - 1 : Number(v))
                                            ))}
                                        </strong>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ORDEM_TURNOS.filter(t => dadosAgrupados[t]?.length > 0).map(turno => (
                            <>
                                <TableRow key={`header-${turno}`}>
                                    <TableCell
                                        colSpan={dias.length + 1}
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
                                {dadosAgrupados[turno].map(prof => (
                                    <TableRow key={prof.id}>
                                        <TableCell sx={{
                                            border: '1px solid #50b5ae', p: 0.5,
                                            position: 'sticky', left: 0, bgcolor: '#f3f3f3', zIndex: 2
                                        }}>
                                            {prof.nome}
                                        </TableCell>
                                        {dias.map(data => {
                                            const turnoCell = getTurno(prof, data);
                                            return (
                                                <TableCell key={data} align="center" sx={{
                                                    border: '1px solid #50b5ae', p: 0.5,
                                                    backgroundColor: data === hoje ? '#e3f2fd' : 'transparent'
                                                }}>
                                                    {turnoCell ? (
                                                        <Box sx={{
                                                            bgcolor: background(turnoCell), borderRadius: 1,
                                                            px: 1, py: 0.3, display: 'inline-block',
                                                            minWidth: 28, fontWeight: 'bold', fontSize: 12
                                                        }}>
                                                            {turnoCell}
                                                        </Box>
                                                    ) : '-'}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TabelaHistorico;

const background = (texto) => {
    if (texto === 'MT') return '#a2ff9a';
    if (texto === 'M') return '#f4ff95';
    if (texto === 'T') return '#ffbf8b';
    if (texto === 'N') return '#bae0ff';
    if (texto === 'F') return '#b8b8b8';
};
