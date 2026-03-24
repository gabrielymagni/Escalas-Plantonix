import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const getColumnsFuncionario = (handleModal) => [
    { id: "id", label: "ID", minWidth: 100 },
    { id: "nome", label: "Nome", minWidth: 50 },
    { id: "email", label: "Email", minWidth: 50 },
    { id: "senha", label: "Senha", minWidth: 50 },
    { id: "coren", label: "Coren", minWidth: 50 },
    { id: "fazPlantao", label: "Plantão", minWidth: 50 },
    { id: "permissao", label: "Permissão", minWidth: 50 },
    { id: "diasFolgas", label: "Folgas", minWidth: 50 },
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
                    onClick={() => console.log("remove da lista")}
                    title="Remover" >
                    <DeleteIcon />
                </IconButton>
            </Box >
        ),
    },
]


export const getRowsFuncionario = () =>
    simulaDados.map((item) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        senha: item.senha,
        coren: item.coren,
        fazPlantao: item.fazPlantao,
        permissao: item.permissao,
        diasFolgas: item.permissao
    }))


export const simulaDados = [
    {
        id: 1,
        nome: "julia",
        email: 'teste',
        senha: 'será',
        coren: 'nao sei oq é',
        fazPlantao: 'sei la',
        permissao: 'nsei',
        diasFolgas: 'sab'
    },
    {
        id: 2,
        nome: "maria",
        email: 'teste',
        senha: 'será',
        coren: 'nao sei oq é',
        fazPlantao: 'sei la',
        permissao: 'nsei',
        diasFolgas: 'sab'
    },
    {
        id: 3,
        nome: "joao",
        email: 'teste',
        senha: 'será',
        coren: 'nao sei oq é',
        fazPlantao: 'sei la',
        permissao: 'nsei',
        diasFolgas: 'sab'
    },

]