import { Button, Grid } from "@mui/material";
import useModalBlocoHook from "../hooks/useModalBlocoHook";
import ModalCadastro from "./ModalCadastro";
import AddIcon from '@mui/icons-material/Add';


const AdicionarCadastro = () => {
    const { openCadastro, handleOpenCadastro } = useModalBlocoHook();
    return (
        <>

            <Grid container sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mt: 3, mb: 5 }} >
                <Grid size={{ xs: 12, md: 3 }}>
                    <Button variant="outlined" startIcon={<AddIcon />} fullWidth
                        onClick={handleOpenCadastro}
                        sx={{ bgcolor: '#141259', color: '#fff', fontWeight: 'bold' }}>
                        Adicionar
                    </Button>
                </Grid>
            </Grid>


            {openCadastro &&
                <ModalCadastro open={openCadastro} handleOpen={handleOpenCadastro} />
            }
        </>
    )
}

export default AdicionarCadastro
