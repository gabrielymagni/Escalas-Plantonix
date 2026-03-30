import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useModalBlocoHook from "../hooks/useModalBlocoHook";
import SaveIcon from '@mui/icons-material/Save';

const ModalEdicao = ({ open, handleOpen, item }) => {

    const { editarBloco } = useModalBlocoHook();
    console.log("item", item)

    return (
        <div>
            <Dialog open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" >

                <DialogTitle sx={{ position: "relative" }}>

                    <Typography sx={{ p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20 }}>Edição de bloco</Typography>

                    <IconButton aria-label="close" onClick={handleOpen} sx={{ position: "absolute", right: 5, top: 5 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={(e) => editarBloco(e, item.id)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <Grid size={{ md: 12, xs: 12 }}>
                                <TextField label="Bloco" variant="filled" name="nome" fullWidth
                                    defaultValue={item.nome} required />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" sx={sxButton} endIcon={<SaveIcon />} >
                            Salvar edição
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default ModalEdicao


export const sxButton = () => ({
    backgroundColor: '#71B6BC',
    color: '#141259',
    border: '2px solid #141259',
    fontWeight: 'bold',
    textTransform: "none",
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0px 6px 15px rgba(0,0,0,0.2)',
    }
})

