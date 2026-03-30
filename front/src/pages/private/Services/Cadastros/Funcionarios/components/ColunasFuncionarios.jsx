import { Box, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formataDataDiaMesAno } from '../../../../../../../utils/formataDataDiaMesAno';

export const getColumnsFuncionario = (handleModal, deleteFuncionario) => [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "nome", label: "Nome", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "coren", label: "Coren", minWidth: 100 },
    { id: "cargo", label: "Cargo", minWidth: 100 },
    { id: "turno", label: "Turno", minWidth: 100 },
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

                <IconButton sx={{ color: '#1b1464' }} onClick={() => handleModal(row)} title="Editar" >
                    <EditIcon />
                </IconButton>

                <IconButton sx={{ color: '#b8492d' }} onClick={() => deleteFuncionario(row.id)} title="Remover" >
                    <DeleteIcon />
                </IconButton>
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
        cargo: item.cargo
    }))



