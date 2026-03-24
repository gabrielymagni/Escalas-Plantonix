import { Button, Grid, TextField, Typography } from '@mui/material'
import TableFuncionarios from './components/TableFuncionarios'
import AddIcon from '@mui/icons-material/Add';
import useFuncionarioHook from './hooks/useFuncionarioHook';
import ModalFuncionario from './components/ModalFuncionario';
import useNovoCadastroFuncionario from './hooks/useNovoCadastroFuncionario';
import ModalCadastro from './components/ModalCadastro';

const Funcionario = () => {
    const { rows, columns, infoLinha, openModal, handleCloseModal } = useFuncionarioHook();
    const { openModalCadastro, handleModalCadastro } = useNovoCadastroFuncionario(); 

    return (
        <>
            <Typography height={'33px'} sx={{ fontSize: '22px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Funcionários
            </Typography>

            <Grid container spacing={2} sx={{
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                mt: 3, mb: 5
            }} >
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Pesquisa" fullWidth
                    // value={campoPesquisa} 
                    // onChange={(event) => changePesquisa(event.target.value)} 
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Button variant="outlined" startIcon={<AddIcon />} fullWidth onClick={handleModalCadastro}
                        sx={{ bgcolor: '#141259', color: '#fff', fontWeight: 'bold' }}>
                        Adicionar
                    </Button>
                </Grid>
            </Grid>

            <TableFuncionarios rows={rows} columns={columns} />

            {openModal &&
                <ModalFuncionario open={openModal} info={infoLinha} handleCloseModal={handleCloseModal} />
            }

            {openModalCadastro && 
            <ModalCadastro open={openModalCadastro} handleCloseModal={handleModalCadastro} />}
        </>
    )
}

export default Funcionario
