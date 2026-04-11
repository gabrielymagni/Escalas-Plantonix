import { Backdrop, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import useFuncionarioHook from './hooks/useFuncionarioHook';
import AdicionarCadastro from './components/AdicionarCadastro';
import { useEffect } from 'react';
import ModalEdicao from './components/ModalEdicao';
import AlertRemove from './components/AlertRemove';
import { Toaster } from 'sonner';
import EstruturaTabela from './components/EstruturaTabela';

const Funcionario = () => {
    const { rows, columns, infoLinha, openModal, handleCloseModal, getAllFuncionarios, loading,
        openRemove, handleModalRemover, deleteFuncionario
     } = useFuncionarioHook();

    useEffect(() => {
        getAllFuncionarios()
    }, [])

    return (
        <>
            <Typography height={'33px'} sx={{ fontSize: '22px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Funcionários
            </Typography>

            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

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

            <EstruturaTabela rows={rows} columns={columns} />

            {openModal &&
                <ModalEdicao open={openModal} info={infoLinha} 
                handleCloseModal={handleCloseModal}/>
            }

            {openRemove &&
                <AlertRemove open={openRemove} onClose={handleModalRemover} 
                item={infoLinha} deleteFuncionario={deleteFuncionario} />
            }

            <Toaster />
        </>
    )
}

export default Funcionario
