import { Box, Chip, Paper, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const TURNO_LABEL = { M: 'Manhã', T: 'Tarde', N: 'Noite' };

const formatarData = (data) => {
    const [ano, mes, dia] = String(data).substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
};

/**
 * Painel exibido abaixo da tabela de escala listando os dias em que
 * a cobertura mínima exigida pela regra do bloco não foi atingida.
 * Se não houver nenhuma deficiência, o painel não é renderizado.
 */
const PainelDeficiencias = ({ deficiencias = [] }) => {
    if (!deficiencias || deficiencias.length === 0) return null;

    // Agrupa por data mantendo a ordem cronológica
    const porData = {};
    deficiencias.forEach(d => {
        if (!porData[d.data]) porData[d.data] = [];
        porData[d.data].push(d);
    });
    const datas = Object.keys(porData).sort();

    return (
        <Paper sx={{ p: 2, border: '2px solid #d32f2f', mt: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WarningAmberIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 'bold', color: '#b71c1c', fontSize: 15 }}>
                    Dias com cobertura insuficiente
                </Typography>
                <Chip
                    label={datas.length}
                    size="small"
                    sx={{
                        bgcolor: '#d32f2f', color: '#fff', fontWeight: 'bold',
                        ml: 0.5, height: 20, fontSize: 12,
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {datas.map(data => (
                    <Box
                        key={data}
                        sx={{
                            bgcolor: '#fff5f5',
                            border: '1px solid #ffcdd2',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.75,
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold', fontSize: 13, color: '#b71c1c', mb: 0.25 }}>
                            {formatarData(data)}
                        </Typography>
                        {porData[data].map((d, i) => (
                            <Typography key={i} sx={{ fontSize: 12, color: '#555' }}>
                                {TURNO_LABEL[d.turno] ?? d.turno}
                                {': mín. '}{d.min_required}
                                {' · alocados '}{d.alocados}
                            </Typography>
                        ))}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default PainelDeficiencias;
