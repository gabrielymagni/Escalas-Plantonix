import { Grid, TextField, Typography } from '@mui/material'
import TableFuncionarios from './components/TableFuncionarios'
import useFuncionarioHook from './hooks/useFuncionarioHook';
import ModalFuncionario from './components/ModalFuncionario';
import AdicionarCadastro from './components/AdicionarCadastro';

const Funcionario = () => {
    const { rows, columns, infoLinha, openModal, handleCloseModal } = useFuncionarioHook();

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

                <AdicionarCadastro />
            </Grid>

            <TableFuncionarios rows={rows} columns={columns} />

            {openModal &&
                <ModalFuncionario open={openModal} info={infoLinha} handleCloseModal={handleCloseModal} />
            }
        </>
    )
}

export default Funcionario
