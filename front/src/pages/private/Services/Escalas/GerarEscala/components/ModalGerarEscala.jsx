import { Autocomplete, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import useModalGerar from "../hooks/useModalGerar";


const ModalGerarEscala = ({ open, handleOpen }) => {

    const { submitGerarEscala, loading, periodos } = useModalGerar();

    return (
        <Dialog fullWidth={'md'} open={open} onClose={() => handleOpen()}
            aria-labelledby="alert-dialog-title" >

            <DialogTitle sx={{ position: "relative" }}>

                <Typography sx={{ p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20 }}>
                    Gerar nova escala
                </Typography>

                <IconButton aria-label="close"
                    onClick={() => handleOpen()}
                    sx={{ position: "absolute", right: 5, top: 5 }} >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => submitGerarEscala(e)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 2
                    }}>
                        <Grid size={{ md: 12, xs: 8 }} sx={{ m: 2 }}>
                            <Autocomplete
                                options={periodos}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField {...params} label="Selecione o período" required
                                        name="periodo" />
                                )}
                                renderOption={({ key, ...props }, option) => (
                                    <li key={key} {...props}>
                                        {option.label}
                                    </li>
                                )}
                            />
                        </Grid>
                    </Grid>

                </DialogContent>

                <DialogActions>
                    <Button type="submit" sx={{
                        bgcolor: '#409158', color: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                        }
                    }} endIcon={<NoteAddIcon />}>
                        Gerar escala
                    </Button>
                </DialogActions>
            </form>

            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>

        </Dialog >
    )
}

export default ModalGerarEscala

// ue kkkkkkkkkk
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
]