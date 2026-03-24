import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { sxButton } from "../../Funcionarios/components/ModalCadastro";
import useModalBlocoHook from "../hooks/useModalBlocoHook";

const ModalCadastro = ({ open, handleOpen }) => {

     const { handleSubmit } = useModalBlocoHook();

    return (
        <Dialog open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" >

            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                Novo bloco
                <IconButton aria-label="close"
                    onClick={handleOpen}
                    sx={{ position: "absolute", right: 8, top: 8 }} >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField label="Bloco" variant="filled" name="nome" fullWidth />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField label="Quantidade de pessoas" variant="filled" name="quant_pessoas" fullWidth />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button type="submit" sx={sxButton}>
                        Cadastrar 
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ModalCadastro
