import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const getColumnsFuncionario = (handleModal, deleteFuncionario) => [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "nome", label: "Nome", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "coren", label: "Coren", minWidth: 100 },
    // { id: "blocos", label: "Blocos", minWidth: 100 },
    {
        id: "detalhes", label: "", minWidth: 50,
        render: (row) => (
            <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'center', height: '100%' }}>
                <IconButton sx={{ color: '#1b1464' }}
                    onClick={() => handleModal(row)}
                    title="Detalhes" >
                    <VisibilityIcon />
                </IconButton>

                <IconButton sx={{ color: '#b8492d' }}
                    onClick={() => deleteFuncionario(row.id)}
                    title="Remover" >
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
