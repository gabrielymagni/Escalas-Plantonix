import { Chip, Divider, Grid, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import useModalBlocoHook from "../hooks/useModalBlocoHook";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import ModalEdicao from "./ModalEdicao";

const CardsBlocos = () => {

    const { allBlocos, getAllBlocos, deleteBloco, editarBloco } = useModalBlocoHook();
    const { openCadastro, handleOpenCadastro } = useModalBlocoHook();
    const [itemSelecionado, setItemSelecionado] = useState({})


    useEffect(() => {
        getAllBlocos()
    }, [])

    return (
        <>
            <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                {allBlocos.map((item) => (
                    <Grid size={{ md: 6, xs: 12 }} sx={{ border: '2px solid #62acb5', p: 2, bgcolor: '#fff', borderRadius: 5 }}>

                        <Chip label={`Código: ${item.id}`} sx={{ mb: 2 }} />

                        <Divider />

                        <Grid size={{ md: 12, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 20, fontWeight: 'bold', mt: 2 }}>
                                {item.nome}
                            </Typography>

                            <Grid size={{ md: 2, xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <IconButton onClick={() => deleteBloco(item.id)} >
                                    <DeleteIcon sx={{ color: '#d46441' }} />
                                </IconButton>
                            </Grid>
                            <Grid size={{ md: 2, xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <IconButton onClick={() => (handleOpenCadastro(), setItemSelecionado(item))} >
                                    <EditIcon sx={{ color: '#a3a3a3' }} />
                                </IconButton>
                            </Grid>
                        </Grid>

                    </Grid>
                ))}

                {openCadastro &&
                    <ModalEdicao open={openCadastro} handleOpen={handleOpenCadastro} item={itemSelecionado} />
                }
            </Grid>

        </>
    )
}

export default CardsBlocos

export const simulaDadosBloco = [
    {
        id: 1,
        bloco: 'Cirúrgico',
    },
    {
        id: 2,
        bloco: 'Maternidade',
    },
    {
        id: 3,
        bloco: 'Clínica',
    },
    {
        id: 4,
        bloco: 'Ambulatório',
    },
]