import { Button, Grid, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CardsBlocos from './components/CardsBlocos';
import ModalCadastro from './components/ModalCadastro';
import useModalBlocoHook from './hooks/useModalBlocoHook';

const Bloco = () => {

    const { openCadastro, handleOpenCadastro } = useModalBlocoHook();

    return (
        <>
            <Typography sx={{ fontSize: '24px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Blocos
            </Typography>


            <Grid container sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 3, mb: 5 }} >

                <Grid size={{ xs: 12, md: 3 }}>
                    <Button variant="outlined" startIcon={<AddIcon />} fullWidth
                        onClick={handleOpenCadastro}
                        sx={{ bgcolor: '#141259', color: '#fff', fontWeight: 'bold' }}>
                        Adicionar
                    </Button>
                </Grid>
            </Grid>

            <CardsBlocos />

            {openCadastro &&
                <ModalCadastro open={openCadastro} handleOpen={handleOpenCadastro} />
            }
        </>
    )
}

export default Bloco
