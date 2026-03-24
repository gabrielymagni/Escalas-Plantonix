import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { simulaDadosBloco } from "../../Blocos/components/ColunasBlocos";
import { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useNovoCadastroFuncionario from "../hooks/useNovoCadastroFuncionario";

const ModalCadastro = ({ open, handleCloseModal }) => {

    const { handleSubmit, handleBlocosRanking, getOptionsFiltradas, rankingBlocos } = useNovoCadastroFuncionario();

    return (
        <>
            <Dialog fullWidth={'md'} open={open} onClose={handleCloseModal} >

                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Novo funcionário
                    <IconButton aria-label="close"
                        onClick={handleCloseModal}
                        sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Nome Completo" variant="filled" name="nome" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Email" variant="filled" name="email" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Coren" variant="filled" name="coren" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Plantão" variant="filled" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Permissão" variant="filled" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField id="filled-basic" label="Folgas" variant="filled" fullWidth />
                            </Grid>
                            <Grid size={{ md: 12, xs: 12 }}>
                                <TextField id="filled-basic" label="Cargo" variant="filled" name="cargo" fullWidth />
                            </Grid>


                            <Grid size={{ md: 6, xs: 12 }}>
                                <Autocomplete multiple
                                    id="tags-outlined"
                                    options={turnosDisponiveis}
                                    getOptionLabel={(option) => option.turno}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Disponibilidade de turnos" />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }} >

                                <Grid container spacing={2} sx={{ border: '2px solid #141259', p: 2, borderRadius: 5 }}>


                                    <Typography sx={{ textAlign: 'center' }}>Ordem de preferência de blocos</Typography>

                                    {simulaDadosBloco.map((item, index) => (
                                            <Autocomplete key={index} size="small" fullWidth
                                                options={getOptionsFiltradas(index)}
                                                getOptionLabel={(option) => option.bloco}
                                                value={rankingBlocos[index] || null}
                                                onChange={(event, newValue) =>
                                                    handleBlocosRanking(index, newValue)
                                                }
                                                renderInput={(params) => (
                                                    <TextField {...params} label={`${index + 1}° opção`} />
                                                )}
                                            />
                                        ))
                                    }
                                </Grid>


                            </Grid>


                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" endIcon={<CheckCircleIcon />} sx={sxButton} >
                            Cadastrar 
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>
        </>
    )
}

export default ModalCadastro


export const turnosDisponiveis = [
    { id: 1, turno: 'Manhã' },
    { id: 2, turno: 'Tarde' },
    { id: 3, turno: 'Noite' },
    { id: 4, turno: 'Manha e Tarde' }
]


export const sxButton = () => ({
    bgcolor: '#62acb5', 
    color: '#fff',
    fontWeight: 'bold'
})