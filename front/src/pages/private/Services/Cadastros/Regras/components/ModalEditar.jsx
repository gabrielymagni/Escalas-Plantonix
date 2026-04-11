import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { sxButton } from "../../Blocos/components/ModalEdicao";
import useModalRegras from "../hooks/useModalRegras";
import useModalBlocoHook from "../../Blocos/hooks/useModalBlocoHook";
import { useEffect } from "react";

const ModalEditar = ({ open, handleOpen, info }) => {

    const { getOpcoesDias, getOpcoesTipoProfissionais, listaTipoDias, listaTipoProfissional, editarRegra } = useModalRegras();
    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    useEffect(() => {
        getOpcoesDias()
        getOpcoesTipoProfissionais()
        getAllBlocos()
    }, [])
    console.log("info", info)

    return (
        <Dialog fullWidth={'md'} open={open} onClose={handleOpen} aria-labelledby="alert-dialog-title" >

            <DialogTitle sx={{ position: "relative" }}>

                <Typography sx={{ p: 2, fontWeight: "bold", color: "#141259", textAlign: "center", fontSize: 20 }}>
                    Editar Regra
                </Typography>

                <IconButton aria-label="close" onClick={handleOpen}
                    sx={{ position: "absolute", right: 5, top: 5 }} >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => editarRegra(e, info.blocos, info.id)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={listaTipoProfissional}
                                value={listaTipoProfissional.find(item => item.tipo === info.tipo_profissional) || null}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo profissional" required name="tipo_profissional"  />
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                options={listaTipoDias}
                                value={listaTipoDias.find(item => item.tipo === info.tipo_dia) || null}
                                getOptionLabel={(option) => option.tipo}
                                renderInput={(params) => (
                                    <TextField {...params} label="Dias" required name="tipo_dia"  />
                                )}
                            />
                        </Grid>
                    </Grid>


                    {info.blocos.map((item, index) => (
                        <Grid container key={index} spacing={2} sx={{
                            m: 2, display: 'flex', borderRadius: 5,
                            justifyContent: 'center', border: '2px solid #55B2B0', p: 1
                        }}>
                            <Grid size={{ md: 4, xs: 12 }}
                                sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography>{item.bloco}</Typography>
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }} sx={{}}>

                                <Typography sx={{ textAlign: 'center', mb: 1 }}>Quantidade de pessoas: </Typography>

                                <Grid size={{ md: 12, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField size='small' variant="standard" label="Manhã" fullWidth required type='number'
                                        name={`${item.bloco} - manha`} defaultValue={item.manha} />
                                    <TextField size='small' variant="standard" label="Tarde" fullWidth required type='number'
                                        name={`${item.bloco} - tarde`} defaultValue={item.tarde}/>
                                    <TextField size='small' variant="standard" label="Noite" fullWidth required type='number'
                                        name={`${item.bloco} - noite`} defaultValue={item.noite} />
                                </Grid>

                            </Grid>
                        </Grid>
                    ))}

                </DialogContent>

                <DialogActions>
                    <Button type="submit" sx={sxButton} endIcon={<SendIcon />} >
                        Salvar edição
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

export default ModalEditar


export const retornaRegras = [
    {
        id: 1,
        tipo_profissional: 'Enfermeira',
        tipo_dia: 'Final de semana',
        blocos: [
            {
                id: 1,
                bloco: 'Uti',
                manha: 1,
                tarde: 2,
                noite: 3
            },
            {
                id: 1,
                bloco: 'Maternidade rert',
                manha: 4,
                tarde: 5,
                noite: 9
            }
        ]
    }
]