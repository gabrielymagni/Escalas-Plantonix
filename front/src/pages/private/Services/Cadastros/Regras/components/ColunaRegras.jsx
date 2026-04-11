import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Chip, IconButton } from '@mui/material';


export const getColumnsRegras = (handleModal, handleRemover) => [
    { id: "tipo_profissional", label: "Tipo de Profissional", minWidth: 200 },
    { id: "tipo_dia", label: "Tipo de dias", minWidth: 200,
        render: (row) => (
            <strong>{retornaTipoDias(row.tipo_dia)}</strong>
        )
     },
    {
        id: "blocos", label: "Manhã", minWidth: 200,
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
    {id: "tarde", label: "Tarde", minWidth: 200,
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
    {id: "noite", label: "Noite", minWidth: 200,
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
    {id: "icones", label: "", minWidth: 50,
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


export const retornaRegras = [
    {
        "id": 4,
        "tipo_profissional": null,
        "tipo_dia": "u",
        "created_at": "2026-04-11T19:06:53.000000Z",
        "updated_at": "2026-04-11T19:06:53.000000Z",
        "blocos": [
            {
                "id": 6,
                "nome": "cirurgico",
                "created_at": "2026-03-28T04:37:16.000000Z",
                "updated_at": "2026-03-28T04:37:16.000000Z",
                "deleted_at": null,
                "pivot": {
                    "regra_id": 4,
                    "bloco_id": 6,
                    "qtd_manha": 2,
                    "qtd_tarde": 1,
                    "qtd_noite": 0,
                    "created_at": "2026-04-11T19:06:53.000000Z",
                    "updated_at": "2026-04-11T19:06:53.000000Z"
                }
            },
            {
                "id": 7,
                "nome": "mater",
                "created_at": "2026-03-28T04:37:16.000000Z",
                "updated_at": "2026-03-28T04:37:16.000000Z",
                "deleted_at": null,
                "pivot": {
                    "regra_id": 4,
                    "bloco_id": 7,
                    "qtd_manha": 1,
                    "qtd_tarde": 1,
                    "qtd_noite": 1,
                    "created_at": "2026-04-11T19:06:53.000000Z",
                    "updated_at": "2026-04-11T19:06:53.000000Z"
                }
            }
        ]
    },
]


export const retornaTipoDias = (tipo) => {
    if (tipo === 'u' || tipo === 'U') return 'Dias útil';
    if (tipo === 'i' || tipo === 'I') return 'Final de semana';
}