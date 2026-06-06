import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { sxButton } from "../../Blocos/components/ModalEdicao";
import { tipoDias, tipoProfissional } from "../hooks/useModalRegras";

const ModalEditar = ({ open, handleOpen, info, editarRegra }) => {
    return (
        <Dialog fullWidth={'md'} open={open} onClose={() => handleOpen(null)} aria-labelledby="alert-dialog-title">

            <DialogTitle sx={{ position: "relative" }}>
                <Typography sx={{ p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20 }}>
                    Editar Regra
                </Typography>

                <IconButton aria-label="close" onClick={() => handleOpen(null)}
                    sx={{ position: "absolute", right: 5, top: 5 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => editarRegra(e, info.blocos, info.id)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={tipoProfissional}
                                defaultValue={tipoProfissional.find(item => item.tipo === info.tipo_profissional) || null}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo profissional" required name="tipo_profissional" />
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={tipoDias}
                                defaultValue={tipoDias.find(item => item.id === info.tipo_dia) || null}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Dias" required name="tipo_dia" />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {info.blocos.map((item, index) => (
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
                                    <TextField size='small' variant="standard" label="Manhã" fullWidth required type='number'
                                        name={`${item.nome} - manha`} defaultValue={item.pivot.qtd_manha} />
                                    <TextField size='small' variant="standard" label="Tarde" fullWidth required type='number'
                                        name={`${item.nome} - tarde`} defaultValue={item.pivot.qtd_tarde} />
                                    <TextField size='small' variant="standard" label="Noite" fullWidth required type='number'
                                        name={`${item.nome} - noite`} defaultValue={item.pivot.qtd_noite} />
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button type="submit" sx={sxButton} endIcon={<SendIcon />}>
                        Salvar edição
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ModalEditar
