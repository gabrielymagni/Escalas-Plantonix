import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { sxButton } from '../../Blocos/components/ModalEdicao';
import SendIcon from '@mui/icons-material/Send';
import useModalRegras, { tipoDias, tipoProfissional } from '../hooks/useModalRegras';
import { useEffect } from 'react';
import useModalBlocoHook from '../../Blocos/hooks/useModalBlocoHook';


const ModalCadastro = ({ open, handleOpen }) => {

    const { getOpcoesDias, getOpcoesTipoProfissionais, listaTipoDias, listaTipoProfissional, submitCadastro } = useModalRegras();
    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    useEffect(() => {
        getOpcoesDias()
        getOpcoesTipoProfissionais()
        getAllBlocos()
    }, [])

    return (
        <Dialog fullWidth={'md'} open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" >

            <DialogTitle sx={{ position: "relative" }}>

                <Typography sx={{ p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20 }}>
                    Cadastro de nova regra
                </Typography>

                <IconButton aria-label="close" onClick={handleOpen} sx={{ position: "absolute", right: 5, top: 5 }} >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => submitCadastro(e, allBlocos)} >
                <DialogContent>
                    <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={listaTipoProfissional}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo profissional" required name="tipo_profissional" />
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={listaTipoDias}
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
                            <Grid size={{ md: 4, xs: 12 }} 
                            sx={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography>{item.nome}</Typography>
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }} sx={{}}>
                                <Typography sx={{ textAlign: 'center', mb: 1 }}>Quantidade de pessoas: </Typography>

                                <Grid size={{ md: 12, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField size='small' variant="standard" label="Manhã" name={`${item.nome} - manha`} fullWidth required type='number' />
                                    <TextField size='small' variant="standard" label="Tarde" name={`${item.nome} - tarde`} fullWidth required type='number' />
                                    <TextField size='small' variant="standard" label="Noite" name={`${item.nome} - noite`} fullWidth required type='number' />
                                </Grid>

                            </Grid>
                        </Grid>

                    ))}

                </DialogContent>

                <DialogActions>
                    <Button type="submit" sx={sxButton} endIcon={<SendIcon />} >
                        Cadastrar
                    </Button>
                </DialogActions>
            </form>

            {/* <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop> */}
        </Dialog >
    )
}

export default ModalCadastro


