import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { formataDataDiaMesAno } from '../../../../../../../utils/formataDataDiaMesAno';

const isAfastadoHoje = (afastamentos = []) => {
    const hoje = new Date().toISOString().split('T')[0];
    return afastamentos.some(af => af.inicio <= hoje && af.fim >= hoje);
};

export const getColumnsFuncionario = (handleModal, handleModalRemover, handleModalAfastamento) => [
    { id: "id", label: "ID", minWidth: 50 },
    {
        id: "nome", label: "Nome", minWidth: 200,
        render: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{row.nome}</span>
                {isAfastadoHoje(row.afastamentos) && (
                    <Chip label="Afastado" size="small" color="warning" variant="outlined" />
                )}
            </Box>
        )
    },
    { id: "email", label: "Email", minWidth: 200 },
    { id: "coren", label: "Coren", minWidth: 100 },
    { id: "cargo", label: "Cargo", minWidth: 200 },
    {
        id: "turno", label: "Turno", minWidth: 200,
        render: (row) => (
            <span>{retornaTurno(row.turno)}</span>
        )
    },
    { id: "tipo_escala", label: "Tipo escala", minWidth: 100 },
    {
        id: "data_contratacao", label: "Data de contratação", minWidth: 200,
        render: (row) => (
            <span>{formataDataDiaMesAno(row.data_contratacao)}</span>
        )
    },
    {
        id: "blocos", label: "Blocos", minWidth: 250,
        render: (row) => {
            if (row.blocos?.length === 0) return "-";

            const blocosOrdenados = [...row.blocos] //esparrama os itens de bloco -> spread operator 
                .sort((a, b) => a.pivot.ordem - b.pivot.ordem);

            return (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: 'center' }}>
                    {blocosOrdenados.map(bloco => (
                        <Chip key={bloco.id} label={`${bloco.pivot.ordem}° ${bloco.nome}`}
                            size="small" color="primary" variant="outlined"
                        />
                    ))}
                </Box>
            );
        }
    },
    {
        id: "icones", label: "", minWidth: 50,
        render: (row) => (
            <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center', height: '100%' }}>

                <Tooltip title="Editar">
                    <IconButton sx={{ color: '#1b1464' }} onClick={() => handleModal(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Gerenciar Afastamentos">
                    <IconButton sx={{ color: '#e67e00' }} onClick={() => handleModalAfastamento(row)}>
                        <EventBusyIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Remover">
                    <IconButton sx={{ color: '#b8492d' }} onClick={() => handleModalRemover(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box >
        ),
    },
]


export const getRowsFuncionario = (dados) =>
    dados.map((item) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        coren: item.coren,
        blocos: item.blocos,
        turno: item.turno,
        tipo_escala: item.tipo_escala,
        data_contratacao: item.data_contratacao,
        cargo: item.cargo,
        afastamentos: item.afastamentos ?? [],
    }))



export const retornaTurno = (sigla) => {
    if (sigla === 'M') return 'Manhã';
    if (sigla === 'T') return 'Tarde';
    if (sigla === 'MT') return 'Manhã e Tarde';
    if (sigla === 'N') return 'Noite';
}