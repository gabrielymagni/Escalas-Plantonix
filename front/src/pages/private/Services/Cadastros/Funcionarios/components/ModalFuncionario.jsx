import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useFuncionarioHook from "../hooks/useFuncionarioHook";
import useModalBlocoHook from "../../Blocos/hooks/useModalBlocoHook";
import { useEffect, useState } from "react";
import { tipoEscala, turnosDisponiveis } from "./ModalCadastro";
import useNovoCadastroFuncionario from "../hooks/useNovoCadastroFuncionario";

const ModalFuncionario = ({ open, info, handleCloseModal }) => {

    console.log("item", info);

    const { editarFuncionario } = useFuncionarioHook();

    const { handleBlocosRanking, getOptionsFiltradas, rankingBlocos, handleTurnos, handleEscala } = useNovoCadastroFuncionario();
    const { allBlocos, getAllBlocos, } = useModalBlocoHook();

    useEffect(() => {
        getAllBlocos()
    }, [])

    // const [rankingBlocos, setRankingBlocos] = useState([]);
    const [turnoSelecionado, setTurnoSelecionado] = useState(turnosDisponiveis.find(item => item.id === info.turno));
    const [escalaSelecionada, setEscalaSelecionada] = useState(tipoEscala.find(item => item.tipo === info.tipo_escala));
    console.log("turnoSelecionado", turnoSelecionado)
    console.log("escalaSelecionada", escalaSelecionada)

    return (
        <div>
            <Dialog fullWidth={'md'} open={open} onClose={handleCloseModal} >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Detalhes

                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>


                <form onSubmit={(e) => editarFuncionario(e, info.id)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Nome Completo" variant="filled" name="nome" fullWidth defaultValue={info.nome} />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Email" variant="filled" name="email" fullWidth defaultValue={info.email} />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Coren" variant="filled" name="coren" fullWidth defaultValue={info.coren} />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Cargo" variant="filled" name="cargo" fullWidth defaultValue={info.cargo} />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Data contratação" variant="filled" name="data_contratacao" fullWidth type="date" defaultValue={info.data_contratacao} />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <Autocomplete
                                    value={escalaSelecionada}
                                    options={tipoEscala}
                                    getOptionLabel={(option) => option.tipo}
                                    onChange={(event, newValue) => {
                                        setEscalaSelecionada(newValue);
                                        handleEscala(event, newValue);
                                    }}
                                    isOptionEqualToValue={(option, value) =>
                                        option.tipo === value
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Tipos de escala" />
                                    )}

                                />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <Autocomplete
                                    value={turnoSelecionado}
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
                        <Button type="submit">Editar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default ModalFuncionario
