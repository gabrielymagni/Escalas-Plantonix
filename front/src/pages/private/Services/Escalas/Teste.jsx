import React, { useMemo, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Stack, Grid, IconButton } from "@mui/material";
import { gerarPeriodo16a15 } from "../../../../../utils/gerarPeriodoEscala";
import { formatarDia, formatarMes } from "../../../../../utils/formataDataDiaMesAno";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ButtonsPrevNext from "./GerarEscala/components/ButtonsPrevNext";

export default function EscalaHospitalTable() {

    // controla o mês visualizado
    const [mesAtual, setMesAtual] = useState(new Date());

    const { inicio, diasNoPeriodo } = useMemo(
        () => gerarPeriodo16a15(mesAtual),
        [mesAtual]
    );

    const proximoMes = () =>
        setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const mesAnterior = () =>
        setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

    //gera dias 
    const renderDiasHeader = () => {
        return Array.from({ length: diasNoPeriodo }, (_, i) => {
            const data = new Date(inicio);
            data.setDate(inicio.getDate() + i);

            return (
                <TableCell key={i} align="center">
                    {formatarDia(data)}
                </TableCell>
            );
        });
    };

    const renderCelulas = () => {
        return Array.from({ length: diasNoPeriodo }, (_, i) => (
            <TableCell key={i} align="center">
                -
            </TableCell>
        ));
    };

    return (
        <>
            <Paper sx={{ p: 2, border: '2px solid #50b5ae' }}>
                <ButtonsPrevNext handleNext={proximoMes} handlePrev={mesAnterior} periodo={formatarMes(inicio)}/> 
                <TableContainer>
                    <Table size="small">

                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <b>Profissional</b>
                                </TableCell>

                                {renderDiasHeader()}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {profissionais.map((prof, index) => (
                                <TableRow key={index}>
                                    <TableCell>{prof.nome}</TableCell>
                                    {renderCelulas()}
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>

            </Paper>
        </>
    );
}

const profissionais = [
    { nome: "Gabriely" },
    { nome: "Carlos" },
    { nome: "Fernanda" },
    { nome: "Lucas" }
];