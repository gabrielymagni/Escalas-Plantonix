import { Autocomplete, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { sxButton } from '../../Blocos/components/ModalEdicao';
import SendIcon from '@mui/icons-material/Send';
import { tipoDias, tipoProfissional } from '../hooks/useModalRegras';

const ModalCadastro = ({ open, handleOpen, submitCadastro, allBlocos }) => {
    return (
        <Dialog fullWidth={'md'} open={open} onClose={() => handleOpen(null)} aria-labelledby="alert-dialog-title">

            <DialogTitle sx={{ position: "relative" }}>
                <Typography sx={{ p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20 }}>
                    Cadastro de nova regra
                </Typography>

                <IconButton aria-label="close" onClick={() => handleOpen(null)} sx={{ position: "absolute", right: 5, top: 5 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => submitCadastro(e, allBlocos)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={tipoProfissional}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo profissional" required name="tipo_profissional" />
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={tipoDias}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Dias" required name="tipo_dia" />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {allBlocos.map((item, index) => (
                        <Grid container key={index} spacing={2} sx={{
                            m: 2, display: 'flex', borderRadius: 5,
                            justifyContent: 'center', border: '2px solid #55B2B0', p: 1
                        }}>
                            <Grid size={{ md: 12, xs: 12 }}
                                sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography>{item.nome}</Typography>
                            </Grid>

                            <Grid size={{ md: 12, xs: 12 }}>
                                <Typography sx={{ textAlign: 'center', mb: 1 }}>Quantidade de pessoas: </Typography>

                                <Grid size={{ md: 12, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField size='small' variant="standard" label="Manhã" name={`${item.nome} - manha`} fullWidth required type='number' />
                                    <TextField size='small' variant="standard" label="Tarde" name={`${item.nome} - tarde`} fullWidth required type='number' />
                                    <TextField size='small' variant="standard" label="Noite" name={`${item.nome} - noite`} fullWidth required type='number' />
                                    <TextField size='small' variant="standard" label="Plantões" name={`${item.nome} - plantoes`} fullWidth type='number' defaultValue={0} inputProps={{ min: 0 }} />
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button type="submit" sx={sxButton} endIcon={<SendIcon />}>
                        Cadastrar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ModalCadastro
