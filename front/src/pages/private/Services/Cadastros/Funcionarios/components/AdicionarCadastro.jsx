import { Button, Grid } from "@mui/material";
import ModalCadastro from "./ModalCadastro";
import AddIcon from '@mui/icons-material/Add';
import useNovoCadastroFuncionario from "../hooks/useNovoCadastroFuncionario";

const AdicionarCadastro = () => {

    const { openModalCadastro, handleModalCadastro } = useNovoCadastroFuncionario();

    return (
        <>
            <Grid size={{ xs: 12, md: 3 }}>
                <Button variant="outlined" startIcon={<AddIcon />} fullWidth onClick={handleModalCadastro}
                    sx={{ bgcolor: '#141259', color: '#fff', fontWeight: 'bold' }}>
                    Adicionar
                </Button>
            </Grid>

            {openModalCadastro &&
                <ModalCadastro open={openModalCadastro} handleCloseModal={handleModalCadastro} />
            }
        </>
    )
}

export default AdicionarCadastro
