import { Autocomplete, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Switch, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useModalBlocoHook from "../../Blocos/hooks/useModalBlocoHook";
import { useEffect, useState } from "react";
import { sxButton } from "../../Blocos/components/ModalEdicao";
import SendIcon from '@mui/icons-material/Send';
import { getOptionsFiltradas } from "../../../../../../../utils/filtraBlocosSelecionados";
import useFuncionarioHook from "../hooks/useFuncionarioHook";
import useNovoCadastroFuncionario from "../hooks/useNovoCadastroFuncionario";

const ModalCadastro = ({ open, handleCloseModal }) => {

    const { handleSubmit } = useNovoCadastroFuncionario();
    const { allBlocos, getAllBlocos, loading } = useModalBlocoHook();
    const { rankingBlocos, handleBlocosRanking, handleTurnos, handleEscala, escalaSelecionada, turnoSelecionado } = useFuncionarioHook();
    const [fazPlantao, setFazPlantao] = useState(true);

    useEffect(() => {
        getAllBlocos()
    }, [])

    return (
        <>
            <Dialog fullWidth={'md'} open={open} onClose={handleCloseModal} >
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={loading} >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Cadastro de novo funcionário
                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={(e) => handleSubmit(e, rankingBlocos, fazPlantao)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>

                            <Grid size={{ md: 12, xs: 12 }}>
                                <TextField label="Nome Completo" variant="filled" name="nome" fullWidth required size="small" />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Email" variant="filled" name="email" fullWidth required type="email" size="small" />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Coren" variant="filled" name="coren" fullWidth size="small" type="number" />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Cargo" variant="filled" name="cargo" fullWidth required size="small" />
                            </Grid>

                            <Grid size={{ md: 6, xs: 12 }}>
                                <TextField label="Data contratação" variant="filled" name="data_contratacao" size="small"
                                    fullWidth type="date" required
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                        input: {
                                            inputProps: {
                                                min: "0001-01-01",
                                                max: "9999-12-31"
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ md: 12, xs: 12 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={fazPlantao}
                                            onChange={(e) => setFazPlantao(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Tira plantão"
                                />
                            </Grid>

                            {fazPlantao && <>
                                <Grid size={{ md: 6, xs: 12 }}>
                                    <Autocomplete
                                        options={tipoEscala}
                                        getOptionLabel={(option) => option.tipo}
                                        onChange={handleEscala}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Tipos de escala" required name="tipo_escala" />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ md: 6, xs: 12 }}>
                                    <Autocomplete
                                        disabled={!escalaSelecionada}
                                        options={turnosDisponiveis(escalaSelecionada?.tipo)}
                                        getOptionLabel={(option) => option.turno}
                                        onChange={handleTurnos}
                                        value={turnoSelecionado}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Disponibilidade de turnos" required name="turno" />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ md: 6, xs: 12 }} >
                                    <Grid container spacing={2} sx={{ border: '2px solid #141259', p: 2, borderRadius: 5 }}>
                                        <Typography sx={{ textAlign: 'center' }}>Ordem de preferência de blocos</Typography>

                                        {allBlocos.map((item, index) => (
                                            <Autocomplete key={index} size="small" fullWidth
                                                options={getOptionsFiltradas(index, allBlocos, rankingBlocos)}
                                                getOptionLabel={(option) => option.nome}
                                                value={rankingBlocos[index] || null}
                                                onChange={(event, newValue) =>
                                                    handleBlocosRanking(index, newValue)
                                                }
                                                renderInput={(params) => (
                                                    <TextField {...params} label={`${index + 1}° opção`} required name="blocos" />
                                                )}
                                            />
                                        ))}
                                    </Grid>
                                </Grid>
                            </>}

                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button type="submit" endIcon={<SendIcon />} sx={sxButton} >
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
    const permitidos = regrasEscala[escala] || [];

    return TODOS_TURNOS.filter(turno =>
        permitidos.includes(turno.id)
    );
};

const regrasEscala = {
    '6x1': ['M', 'T'],
    '5x2': ['MT'],
    '12x36': ['N'],
};

export const TODOS_TURNOS = [
    { id: 'M', turno: 'Manhã' },
    { id: 'T', turno: 'Tarde' },
    { id: 'MT', turno: 'Manhã e Tarde' },
    { id: 'N', turno: 'Noite' },
];

export const tipoEscala = [
    { tipo: '6x1' },
    { tipo: '12x36' },
    { tipo: '5x2' },
]

