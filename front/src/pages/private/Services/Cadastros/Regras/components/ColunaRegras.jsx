import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Chip, IconButton } from '@mui/material';


export const getColumnsRegras = (handleModal, handleRemover) => [
    { id: "tipo_profissional", label: "Tipo de Profissional", width: "20%" },
    { id: "tipo_dia", label: "Tipo de dias", width: "10%",
        render: (row) => (
            <strong>{retornaTipoDias(row.tipo_dia)}</strong>
        )
     },
    {
        id: "blocos", label: "Manhã", width: "20%",
        render: (row) => {
            if (!row.blocos?.length) return "-";

            return (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: 'center', alignItems:'center' }}>
                    {row.blocos.map(item => (
                        <Chip key={`m-${item.id}`}
                            label={`${item.nome}: ${item.pivot.qtd_manha}`}
                            size="small" color="primary" variant="outlined"
                        />
                    ))}
                </Box>
            );
        }
    },
    {id: "tarde", label: "Tarde", width: "20%",
        render: (row) => {
            if (!row.blocos?.length) return "-";

            return (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: 'center', alignItems:'center' }}>
                    {row.blocos.map(item => (
                        <Chip key={`m-${item.id}`}
                            label={`${item.nome}: ${item.pivot.qtd_tarde}`}
                            size="small" color="primary" variant="outlined"
                        />
                    ))}
                </Box>
            );
        }
    },
    {id: "noite", label: "Noite", width: "20%",
        render: (row) => {
            if (!row.blocos?.length) return "-";

            return (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: 'center', alignItems:'center' }}>
                    {row.blocos.map(item => (
                        <Chip key={`m-${item.id}`}
                            label={`${item.nome}: ${item.pivot.qtd_noite}`}
                            size="small" color="primary" variant="outlined"
                        />
                    ))}
                </Box>
            );
        }
    },
    {id: "icones", label: "", width: "5%",
        render: (row) => (
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
                <IconButton sx={{ color: "#1b1464" }} onClick={() => handleModal(row)} title="Editar">
                    <EditIcon />
                </IconButton>

                <IconButton sx={{ color: "#b8492d" }} onClick={() => handleRemover(row)} title="Remover">
                    <DeleteIcon />
                </IconButton>
            </Box>
        )
    }
];



export const retornaTipoDias = (tipo) => {
    if (tipo === 'u' || tipo === 'U') return 'Dias útil';
    if (tipo === 'i' || tipo === 'I') return 'Final de semana';
}