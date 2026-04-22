import { Button, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ModalCadastro from './ModalCadastro';
import useModalRegras from '../hooks/useModalRegras';


const AdicionarRegras = () => {

    const { open, handleOpen } = useModalRegras();

    return (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 3, mb: 5 }} >

            <Grid size={{ xs: 12, md: 3 }}>
                <Button variant="outlined" startIcon={<AddIcon />} fullWidth
                    onClick={() => handleOpen(null)}
                    sx={{ bgcolor: '#141259', color: '#fff', fontWeight: 'bold' }}>
                    Adicionar
                </Button>
            </Grid>

            {open &&
                <ModalCadastro open={open} handleOpen={handleOpen} />
            }

        </Grid>
    )
}

export default AdicionarRegras
