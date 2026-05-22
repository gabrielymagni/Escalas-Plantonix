import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useMemo } from 'react';
import { formatarDia } from '../../../../../../../utils/formataDataDiaMesAno';

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
                            {dias.map(data => (
                                <TableCell key={data} align="center" sx={{
                                    border: '1px solid #50b5ae', p: 0.7,
                                    backgroundColor: data === hoje ? '#e3f2fd' : 'transparent',
                                    fontWeight: data === hoje ? 'bold' : 'normal',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <strong>
                                        {formatarDia(new Date(
                                            ...data.split('-').map((v, i) => i === 1 ? Number(v) - 1 : Number(v))
                                        ))}
                                    </strong>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dadosEscala.map(prof => (
                            <TableRow key={prof.id}>
                                <TableCell sx={{
                                    border: '1px solid #50b5ae', p: 0.5,
                                    position: 'sticky', left: 0, bgcolor: '#f3f3f3', zIndex: 2
                                }}>
                                    {prof.nome}
                                </TableCell>
                                {dias.map(data => {
                                    const turno = getTurno(prof, data);
                                    return (
                                        <TableCell key={data} align="center" sx={{
                                            border: '1px solid #50b5ae', p: 0.5,
                                            backgroundColor: data === hoje ? '#e3f2fd' : 'transparent'
                                        }}>
                                            {turno ? (
                                                <Box sx={{
                                                    bgcolor: background(turno), borderRadius: 1,
                                                    px: 1, py: 0.3, display: 'inline-block',
                                                    minWidth: 28, fontWeight: 'bold', fontSize: 12
                                                }}>
                                                    {turno}
                                                </Box>
                                            ) : '-'}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
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
