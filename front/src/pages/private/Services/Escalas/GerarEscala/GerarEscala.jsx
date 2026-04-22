import Timeline, { TimelineHeaders, DateHeader, SidebarHeader } from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Container, Grid, IconButton, TextField, Typography } from '@mui/material'
import useGerarEscala from "./hooks/useGerarEscala";
import CustomizaEventos from "./components/CustomizaEventos";
import moment from "../../../../../../utils/moment";
import useModalBlocoHook from "../../Cadastros/Blocos/hooks/useModalBlocoHook";
import ButtonsPrevNext from "./components/ButtonsPrevNext";
import useFuncionarioHook from "../../Cadastros/Funcionarios/hooks/useFuncionarioHook";

export default function GerarEscala() {

    const { getEscala, dadosEscala, semanaSelecionada, handlePrev, handleNext, setDadosEscala } = useGerarEscala();
    const { allBlocos, getAllBlocos } = useModalBlocoHook();
    const { getAllFuncionarios, allFuncionarios } = useFuncionarioHook();

    const gruposFuncionarios = allFuncionarios.map(item => ({
        id: item.id,
        title: item.nome
    }));


    useEffect(() => {
        getAllBlocos();
        getAllFuncionarios();
        getEscala();
    }, [])

    const periodo = `${moment(semanaSelecionada.inicio).format("MMMM")}, ${moment(semanaSelecionada.inicio).format("DD/MM/YYYY")} - ${moment(semanaSelecionada.fim).format("DD/MM/YYYY")}`;
    console.log("dadosEscala", dadosEscala)
    console.log("all", allFuncionarios)

    const handleItemMove = (itemId, dragTime, newGroupOrder) => {
        setDadosEscala((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item;

                const duration = item.end_time - item.start_time;

                return {
                    ...item,
                    start_time: dragTime,
                    end_time: dragTime + duration,
                    group: gruposFuncionarios[newGroupOrder].id,
                };
            })
        );
    };

    const handleChangeItem = (id, novoValor) => {
        setDadosEscala((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, title: novoValor }
                    : item
            )
        );
    };

    return (
        <>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', pb: 4 }}>
                <Grid size={{ md: 4, xs: 6 }} >
                    <Autocomplete
                        options={allBlocos}
                        getOptionLabel={(option) => option.nome}
                        renderInput={(params) => (
                            <TextField {...params} label="Blocos" required name="blocos" />
                        )}
                    />
                </Grid>

                <Grid size={{ md: 4, xs: 6 }} >
                    <Button sx={{
                        bgcolor: '#0e640b', color: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                        }
                    }}>
                        Gerar escala
                    </Button>
                </Grid>

            </Grid>

            <ButtonsPrevNext periodo={periodo} handlePre={handlePrev} handleNext={handleNext} />

            {dadosEscala &&
                <div style={{ width: "100%", border: '2px solid #50b5ae' }}>

                    <Timeline groups={gruposFuncionarios} items={dadosEscala}
                        visibleTimeStart={semanaSelecionada.inicio}
                        visibleTimeEnd={semanaSelecionada.fim}
                        onTimeChange={(inicio, fim) => setSemanaSelecionada({ inicio, fim })}
                        itemRenderer={(props) => (
                            <CustomizaEventos
                                {...props}
                                onChangeItem={handleChangeItem}
                            />
                        )}
                        sidebarWidth={300}
                        canMove
                        canResize={false}
                        onItemMove={handleItemMove}
                        lineHeight={50}
                    >
                        <TimelineHeaders>

                            {/* aqui ajusto o primeiro quadrado */}
                            <SidebarHeader>
                                {({ getRootProps }) => {
                                    return (
                                        <div
                                            {...getRootProps()}
                                            style={{
                                                ...getRootProps().style,
                                                backgroundColor: '#ebeaed',
                                            }}
                                        >
                                        </div>
                                    );
                                }}
                            </SidebarHeader>


                            <DateHeader unit="day" labelFormat="ddd DD" />


                        </TimelineHeaders>
                    </Timeline>
                </div>
            }
        </>
    );
}


const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
]