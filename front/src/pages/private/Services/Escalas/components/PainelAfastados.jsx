import { Box, Chip, Paper, Typography } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const MOTIVOS = {
    ferias:   { label: 'Férias',    color: '#1565c0', bg: '#e3f2fd' },
    licenca:  { label: 'Licença',   color: '#6a1b9a', bg: '#f3e5f5' },
    atestado: { label: 'Atestado',  color: '#e65100', bg: '#fff3e0' },
    outros:   { label: 'Outros',    color: '#555555', bg: '#f5f5f5' },
};

const formatarData = (data) => {
    const [ano, mes, dia] = String(data).substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
};

/**
 * Painel exibido abaixo da tabela de escala listando os funcionários
 * afastados (férias, licença, atestado…) que cobrem algum dia do período
 * exibido. Se não houver nenhum afastamento, o painel não é renderizado.
 */
const PainelAfastados = ({ afastados = [] }) => {
    if (!afastados || afastados.length === 0) return null;

    return (
        <Paper sx={{ p: 2, border: '2px solid #f4a000', mt: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PersonOffIcon sx={{ color: '#e65100', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 'bold', color: '#b35900', fontSize: 15 }}>
                    Funcionários afastados neste período
                </Typography>
                <Chip
                    label={afastados.length}
                    size="small"
                    sx={{ bgcolor: '#f4a000', color: '#fff', fontWeight: 'bold', ml: 0.5, height: 20, fontSize: 12 }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {afastados.map((a, i) => {
                    const m = MOTIVOS[a.motivo] ?? MOTIVOS.outros;
                    return (
                        <Box
                            key={i}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: m.bg,
                                border: `1px solid ${m.color}33`,
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.75,
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', fontSize: 13, color: '#333' }}>
                                {a.nome}
                            </Typography>
                            <Chip
                                label={m.label}
                                size="small"
                                sx={{ bgcolor: m.color, color: '#fff', fontWeight: 'bold', fontSize: 11, height: 20 }}
                            />
                            <Typography sx={{ fontSize: 12, color: '#555' }}>
                                {formatarData(a.inicio)} → {formatarData(a.fim)}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default PainelAfastados;
