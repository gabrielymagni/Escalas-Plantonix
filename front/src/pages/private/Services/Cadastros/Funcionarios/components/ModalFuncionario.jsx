import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

const ModalFuncionario = ({ open, info, handleCloseModal }) => {

    const handleSubmit = (evento) => {
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const nome = dados.get("nome");
        console.log("NOME", nome)

        if (info.nome === nome){
            console.log("ta igual")
        }
    }

    return (
        <div>
            <Dialog fullWidth={'md'} open={open} onClose={handleCloseModal} >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Detalhes

                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Nome Completo" variant="filled" name="nome" defaultValue={info.nome} />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Email" variant="filled" name="email" defaultValue={info.email} />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Coren" variant="filled" name="coren" />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Plantão" variant="filled" />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Permissão" variant="filled" />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Folgas" variant="filled" />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit"
                            // onClick={handleCloseModal}
                        >Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default ModalFuncionario
