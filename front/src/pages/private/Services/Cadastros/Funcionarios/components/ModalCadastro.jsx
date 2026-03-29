import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useNovoCadastroFuncionario from "../hooks/useNovoCadastroFuncionario";
import useModalBlocoHook from "../../Blocos/hooks/useModalBlocoHook";
import { useEffect } from "react";

const ModalCadastro = ({ open, handleCloseModal }) => {

    const { handleSubmit, handleBlocosRanking, getOptionsFiltradas, rankingBlocos, handleTurnos, handleEscala, escalaSelecionada } = useNovoCadastroFuncionario();
    const { allBlocos, getAllBlocos, } = useModalBlocoHook();

    useEffect(() => {
        getAllBlocos()
    }, [])


    return (
        <>
            <Dialog fullWidth={'md'} open={open} onClose={handleCloseModal} >

                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Novo funcionário
                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Nome Completo" variant="filled" name="nome" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Email" variant="filled" name="email" fullWidth />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Coren" variant="filled" name="coren" fullWidth />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Cargo" variant="filled" name="cargo" fullWidth />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Data contratação" variant="filled" name="data_contratacao" fullWidth type="date" />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <Autocomplete
                                    options={tipoEscala}
                                    getOptionLabel={(option) => option.tipo}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Tipos de escala" />
                                    )}
                                    onChange={(event, newValue) => handleEscala(event, newValue)}
                                />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <Autocomplete disabled={escalaSelecionada.length === 0}
                                    options={turnosDisponiveis(escalaSelecionada.tipo)}
                                    getOptionLabel={(option) => option.turno}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Disponibilidade de turnos" />
                                    )}
                                    onChange={(event, newValue) => handleTurnos(event, newValue)}
                                />
                            </Grid>


                            <Grid size={{ md: 6, xs: 12 }} >

                                <Grid container spacing={2} sx={{ border: '2px solid #141259', p: 2, borderRadius: 5 }}>


                                    <Typography sx={{ textAlign: 'center' }}>Ordem de preferência de blocos</Typography>

                                    {allBlocos.map((item, index) => (
                                        <Autocomplete key={index} size="small" fullWidth
                                            options={getOptionsFiltradas(index, allBlocos)}
                                            getOptionLabel={(option) => option.nome}
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


export const turnosDisponiveis = (escala) => {
    if (escala === '6x1') return [
        { id: 'M', turno: 'Manhã' },
        { id: 'T', turno: 'Tarde' },
    ];
    if (escala === '5x2') return [
        { id: 'MT', turno: 'Manhã e Tarde' },
    ];
    if (escala === '12x36') return [
        { id: 'N', turno: 'Noite' },
    ];
}

export const tipoEscala = [
    { tipo: '6x1' },
    { tipo: '12x36' },
    { tipo: '5x2' },
]


export const sxButton = () => ({
    bgcolor: '#141259',
    color: '#fff',
    fontWeight: 'bold'
})