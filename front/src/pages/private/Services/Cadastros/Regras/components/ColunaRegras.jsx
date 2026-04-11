import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';


export const getColumnsRegras = (handleModal, handleModalRemover) => [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "tipo_profissional", label: "Profissional", minWidth: 200 },
    { id: "tipo_dia", label: "Tipo dias", minWidth: 200 },
    {id: "blocos", label: "Quantidade de pessoas", minWidth: 300,
        render: (row) => {
            if (row.blocos?.length === 0) return "-";

            return (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: 'center' }}>
                    {row.blocos.map(bloco => (
                        <>
                            <Chip key={bloco.id} label={`Manhã: ${bloco.manha}`}
                                size="small" color="primary" variant="outlined"
                            />
                            <Chip key={bloco.id} label={`Tarde: ${bloco.tarde}`}
                                size="small" color="primary" variant="outlined"
                            />
                            <Chip key={bloco.id} label={`Noite: ${bloco.noite}`}
                                size="small" color="primary" variant="outlined"
                            />
                        </>
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

                <IconButton sx={{ color: '#b8492d' }} onClick={() => handleModalRemover(row)} title="Remover" >
                    <DeleteIcon />
                </IconButton>
            </Box >
        ),
    },
]

export default ColunaRegras



export const retornaRegras = [
    {
        id: 1,
        tipo_profissional: 'Enfermeira',
        tipo_dia: 'Final de semana',
        blocos: [
            {
                id: 1,
                bloco: 'Uti',
                manha: 1,
                tarde: 2,
                noite: 3
            },
            {
                id: 1,
                bloco: 'Maternidade rert',
                manha: 4,
                tarde: 5,
                noite: 9
            }
        ]
    }
]