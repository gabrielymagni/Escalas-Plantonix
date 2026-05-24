import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import useFuncionarioHook from "../hooks/useFuncionarioHook";
import useModalBlocoHook from "../../Blocos/hooks/useModalBlocoHook";
import { useEffect, useState } from "react";
import { tipoEscala, turnosDisponiveis } from "./ModalCadastro";
import { getOptionsFiltradas } from "../../../../../../../utils/filtraBlocosSelecionados";
import { sxButton } from "../../Blocos/components/ModalEdicao";
import SaveIcon from '@mui/icons-material/Save';

const rolesDisponiveis = [
    { id: 'admin', label: 'Administrador' },
    { id: 'funcionario', label: 'Funcionário' },
];

const ModalEdicao = ({ open, info, handleCloseModal, onSuccess }) => {

    const { rankingBlocos, handleBlocosRanking, handleTurnos, turnoSelecionado, editarFuncionario,
        escalaSelecionada, handleEscala, setEscalaSelecionada, setTurnoSelecionado } = useFuncionarioHook();
    const [fazPlantao, setFazPlantao] = useState(true);
    const [roleSelecionada, setRoleSelecionada] = useState(rolesDisponiveis[1]);
    const [cargo, setCargo] = useState('');

    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    useEffect(() => {
        getAllBlocos();
    }, []);

    useEffect(() => {

        if (!info) return;

        setFazPlantao(info.faz_plantao ?? true);
        setCargo(info.cargo ?? '');

        const roleEncontrada = rolesDisponiveis.find(r => r.id === info.role) ?? rolesDisponiveis[1];
        setRoleSelecionada(roleEncontrada);

        const escala = tipoEscala.find(item => item.tipo === info.tipo_escala);
        setEscalaSelecionada(escala || null);

        const turnos = escala ? turnosDisponiveis(escala.tipo) : [];
        const turno = turnos.find(item => item.id === info.turno);
        setTurnoSelecionado(turno || null);

        const blocosOrdenados = [...info.blocos].sort((a, b) => a.pivot.ordem - b.pivot.ordem);
        const rankingInicial = [];
        blocosOrdenados.forEach((bloco) => { rankingInicial[bloco.pivot.ordem - 1] = bloco; });
        handleBlocosRanking(rankingInicial);

    }, [info]);


    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseModal}>

            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                Detalhes

                <IconButton onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }} >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={(e) => editarFuncionario(e, info.id, fazPlantao, roleSelecionada?.id, onSuccess)}>

                <DialogContent>

                    <Grid container spacing={2}>

                        <Grid size={{ md: 12, xs: 12 }}>
                            <TextField label="Nome Completo" name="nome" fullWidth variant="filled" required defaultValue={info?.nome} />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField label="Email" name="email" fullWidth variant="filled" required type="email" defaultValue={info?.email} />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField label="Coren" name="coren" fullWidth variant="filled" defaultValue={info?.coren} />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <FormControl variant="filled" fullWidth required>
                                <InputLabel>Cargo</InputLabel>
                                <Select name="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                                    <MenuItem value="Enfermeira">Enfermeira</MenuItem>
                                    <MenuItem value="Técnica">Técnica</MenuItem>
                                    <MenuItem value="Gestor">Gestor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <TextField label="Data contratação" name="data_contratacao" type="date" fullWidth required variant="filled"
                                defaultValue={info?.data_contratacao}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    input: { inputProps: { min: "0001-01-01", max: "9999-12-31" } }
                                }}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
                            <Autocomplete
                                value={roleSelecionada}
                                options={rolesDisponiveis}
                                getOptionLabel={(option) => option.label}
                                onChange={(_, v) => setRoleSelecionada(v)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Perfil de acesso" required name="role" />
                                )}
                            />
                        </Grid>

                        <Grid size={{ md: 6, xs: 12 }}>
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
                                    value={escalaSelecionada}
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

                            <Grid size={{ md: 6, xs: 12 }}>
                                <Grid container spacing={2} sx={{ border: '2px solid #141259', p: 2, borderRadius: 5 }}>
                                    <Typography sx={{ textAlign: 'center', width: '100%' }}>
                                        Ordem de preferência de blocos
                                    </Typography>

                                    {allBlocos.map((item, index) => (
                                        <Autocomplete
                                            key={index}
                                            size="small"
                                            fullWidth
                                            options={getOptionsFiltradas(index, allBlocos, rankingBlocos)}
                                            value={rankingBlocos[index] || null}
                                            getOptionLabel={(option) => option?.nome ?? ""}
                                            onChange={(event, newValue) => handleBlocosRanking(index, newValue)}
                                            renderInput={(params) => (
                                                <TextField {...params} label={`${index + 1}° opção`} name="blocos" required />
                                            )}
                                        />
                                    ))}
                                </Grid>
                            </Grid>
                        </>}

                    </Grid>

                </DialogContent>

                <DialogActions>
                    <Button type="submit" endIcon={<SaveIcon />} sx={sxButton}> Salvar edição</Button>
                </DialogActions>

            </form>

        </Dialog>
    );
};

export default ModalEdicao;
