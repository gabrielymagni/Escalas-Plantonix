import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControl, IconButton, InputLabel, MenuItem, Select,
    TextField, Tooltip, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import api from '../../../../../../services/api';
import { toast } from 'sonner';

const MOTIVOS = [
    { value: 'ferias', label: 'Férias' },
    { value: 'licenca', label: 'Licença' },
    { value: 'atestado', label: 'Atestado' },
    { value: 'outros', label: 'Outros' },
];

const formatarData = (data) => {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
};

const isAfastamentoAtivo = (afastamento) => {
    const hoje = new Date().toISOString().split('T')[0];
    return afastamento.inicio <= hoje && afastamento.fim >= hoje;
};

const ModalAfastamento = ({ open, onClose, funcionario, onUpdate }) => {
    const [motivo, setMotivo] = useState('ferias');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);

    const afastamentos = funcionario?.afastamentos ?? [];

    const resetForm = () => {
        setMotivo('ferias');
        setInicio('');
        setFim('');
        setDescricao('');
    };

    const handleRegistrar = async () => {
        if (!inicio || !fim) {
            toast.error('Preencha as datas de início e fim.');
            return;
        }
        if (motivo === 'outros' && !descricao.trim()) {
            toast.error('Descrição obrigatória para motivo "Outros".');
            return;
        }

        setLoading(true);
        try {
            const payload = { motivo, inicio, fim };
            if (motivo === 'outros') payload.descricao = descricao;

            const response = await api.post(`/funcionario/${funcionario.id}/afastamento`, payload);
            if (response.status === 201) {
                const { itens_afetados } = response.data;
                resetForm();
                onClose();
                onUpdate();
                toast.success(
                    itens_afetados > 0
                        ? `Afastamento registrado. ${itens_afetados} turno(s) tornaram-se vacância.`
                        : 'Afastamento registrado com sucesso.'
                );
            }
        } catch (error) {
            const msg = error.response?.data?.message ?? 'Erro ao registrar afastamento.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleRemover = async (afastamentoId) => {
        setLoading(true);
        try {
            await api.delete(`/afastamento/${afastamentoId}`);
            toast.success('Afastamento removido.');
            onUpdate();
        } catch {
            toast.error('Erro ao remover afastamento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: '#222059', fontWeight: 'bold' }}>
                Afastamentos — {funcionario?.nome}
            </DialogTitle>

            <DialogContent dividers>
                {/* Histórico */}
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#555' }}>
                    Histórico
                </Typography>

                {afastamentos.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
                        Nenhum afastamento registrado.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        {afastamentos.map((af) => (
                            <Box key={af.id} sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                p: 1, border: '1px solid #e0e0e0', borderRadius: 1,
                                bgcolor: isAfastamentoAtivo(af) ? '#fff8e1' : 'transparent'
                            }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {MOTIVOS.find(m => m.value === af.motivo)?.label ?? af.motivo}
                                        </Typography>
                                        {isAfastamentoAtivo(af) && (
                                            <Chip label="Ativo" size="small" color="warning" />
                                        )}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                        {formatarData(af.inicio)} → {formatarData(af.fim)}
                                    </Typography>
                                    {af.descricao && (
                                        <Typography variant="caption" sx={{ display: 'block', color: '#888' }}>
                                            {af.descricao}
                                        </Typography>
                                    )}
                                </Box>
                                <Tooltip title="Remover afastamento">
                                    <IconButton size="small" sx={{ color: '#b8492d' }}
                                        onClick={() => handleRemover(af.id)} disabled={loading}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Novo afastamento */}
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#555' }}>
                    Registrar novo afastamento
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Motivo</InputLabel>
                        <Select value={motivo} label="Motivo" onChange={(e) => setMotivo(e.target.value)}>
                            {MOTIVOS.map(m => (
                                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Início" type="date" size="small" fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={inicio} onChange={(e) => setInicio(e.target.value)} />
                        <TextField label="Fim" type="date" size="small" fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={fim} onChange={(e) => setFim(e.target.value)} />
                    </Box>

                    {motivo === 'outros' && (
                        <TextField label="Descrição" multiline rows={2} size="small" fullWidth
                            value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">Fechar</Button>
                <Button variant="contained" startIcon={<AddIcon />}
                    onClick={handleRegistrar} disabled={loading}
                    sx={{ bgcolor: '#222059', '&:hover': { bgcolor: '#1b1464' } }}>
                    Registrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalAfastamento;
