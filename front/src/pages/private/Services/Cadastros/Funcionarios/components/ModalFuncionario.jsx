import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useFuncionarioHook from "../hooks/useFuncionarioHook";
import useModalBlocoHook from "../../Blocos/hooks/useModalBlocoHook";
import { useEffect, useState } from "react";
import { tipoEscala, turnosDisponiveis } from "./ModalCadastro";
import useNovoCadastroFuncionario from "../hooks/useNovoCadastroFuncionario";

const ModalFuncionario = ({ open, info, handleCloseModal }) => {

    const { editarFuncionario, rankingBlocos, handleBlocosRanking } = useFuncionarioHook();

    const {
        getOptionsFiltradas,
        handleTurnos,
        handleEscala
    } = useNovoCadastroFuncionario();

    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [turnoSelecionado, setTurnoSelecionado] = useState(null);

    useEffect(() => {
        getAllBlocos();
    }, []);

    useEffect(() => {

        if (!info) return;

        const escala = tipoEscala.find(
            item => item.tipo === info.tipo_escala
        );

        setEscalaSelecionada(escala || null);

        const turnos = escala
            ? turnosDisponiveis(escala.tipo)
            : []; 

        const turno = turnos.find(
            item => item.id === info.turno
        );

        setTurnoSelecionado(turno || null);

        // ordena pela ordem do pivot
        const blocosOrdenados = [...info.blocos]
            .sort((a, b) => a.pivot.ordem - b.pivot.ordem);

        // monta array na posição correta
        const rankingInicial = [];

        blocosOrdenados.forEach((bloco) => {
            rankingInicial[bloco.pivot.ordem - 1] = bloco;
        });

        handleBlocosRanking(rankingInicial);

    }, [info]);


    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseModal}>

            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#141259",
                    position: "relative"
                }}
            >
                Detalhes

                <IconButton
                    onClick={handleCloseModal}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => editarFuncionario(e, info.id)}>

                <DialogContent>

                    <Grid container spacing={2}>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField
                                label="Nome Completo"
                                name="nome"
                                fullWidth
                                variant="filled"
                                defaultValue={info?.nome}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                variant="filled"
                                defaultValue={info?.email}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField
                                label="Coren"
                                name="coren"
                                fullWidth
                                variant="filled"
                                defaultValue={info?.coren}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField
                                label="Cargo"
                                name="cargo"
                                fullWidth
                                variant="filled"
                                defaultValue={info?.cargo}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField
                                label="Data contratação"
                                name="data_contratacao"
                                type="date"
                                fullWidth
                                variant="filled"
                                defaultValue={info?.data_contratacao}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                value={escalaSelecionada}
                                options={tipoEscala}
                                getOptionLabel={(option) => option?.tipo ?? ""}
                                isOptionEqualToValue={(option, value) =>
                                    option.tipo === value.tipo
                                }
                                onChange={(event, newValue) => {
                                    setEscalaSelecionada(newValue);
                                    setTurnoSelecionado(null);
                                    handleEscala(event, newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipos de escala" name="tipo_escala"/>
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                value={turnoSelecionado}
                                options={
                                    escalaSelecionada
                                        ? turnosDisponiveis(escalaSelecionada.tipo)
                                        : []
                                }
                                getOptionLabel={(option) => option?.turno ?? ""}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                onChange={(event, newValue) => {
                                    setTurnoSelecionado(newValue);
                                    handleTurnos(event, newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Disponibilidade de turnos" name="turno" />
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>

                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    border: '2px solid #141259',
                                    p: 2,
                                    borderRadius: 5
                                }}
                            >

                                <Typography sx={{ textAlign: 'center', width: '100%' }}>
                                    Ordem de preferência de blocos
                                </Typography>

                                {allBlocos.map((item, index) => (

                                    <Autocomplete
                                        key={index}
                                        size="small"
                                        fullWidth
                                        options={getOptionsFiltradas(index, allBlocos)}
                                        value={rankingBlocos[index] || null}
                                        getOptionLabel={(option) => option?.nome ?? ""}
                                        onChange={(event, newValue) =>
                                            handleBlocosRanking(index, newValue)
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label={`${index + 1}° opção`} name="blocos" />
                                        )}
                                    />

                                ))}

                            </Grid>

                        </Grid>

                    </Grid>

                </DialogContent>

                <DialogActions>
                    <Button type="submit">Editar</Button>
                </DialogActions>

            </form>

        </Dialog>
    );
};

export default ModalFuncionario;
