import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useModalBlocoHook from "../hooks/useModalBlocoHook";

const ModalEdicao = ({open, handleOpen, item}) => {
    
    const { editarBloco } = useModalBlocoHook();
    console.log("item", item)

    return (
        <div>
            <Dialog open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" >

                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Edição de bloco
                    <IconButton aria-label="close"
                        onClick={handleOpen}
                        sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={(e) => editarBloco(e, item.id)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <Grid size={{ md: 12, xs: 12 }}>
                                <TextField label="Bloco" variant="filled" name="nome" fullWidth defaultValue={item.nome}/>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" sx={sxButton}>
                            Editar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default ModalEdicao


export const sxButton = () => ({
    bgcolor: '#141259',
    color: '#fff',
    fontWeight: 'bold'
})