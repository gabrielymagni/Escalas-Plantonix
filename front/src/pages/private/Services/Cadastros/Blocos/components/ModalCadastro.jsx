import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useModalBlocoHook from "../hooks/useModalBlocoHook";
import SendIcon from '@mui/icons-material/Send';
import { sxButton } from "./ModalEdicao";

const ModalCadastro = ({ open, handleOpen }) => {

    const { cadastrarSubmit, loading } = useModalBlocoHook();

    return (
        <Dialog open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" >

            <DialogTitle sx={{position: "relative" }}>
                
                <Typography sx={{p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20}}>Cadastro de novo bloco</Typography>

                <IconButton aria-label="close" onClick={handleOpen} sx={{ position: "absolute", right: 5, top: 5 }} >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={cadastrarSubmit}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid size={{ md: 12, xs: 12 }}>
                            <TextField label="Bloco" variant="filled" name="nome" fullWidth required />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" sx={sxButton} endIcon={<SendIcon />} >
                        Cadastrar
                    </Button>
                </DialogActions>
            </form>

            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Dialog>
    )
}

export default ModalCadastro
