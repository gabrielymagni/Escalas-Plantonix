import { Backdrop, Chip, CircularProgress, Divider, Grid, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import useModalBlocoHook from "../hooks/useModalBlocoHook";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import ModalEdicao from "./ModalEdicao";
import AlertRemove from "./AlertRemove";
import { Toaster } from "sonner";

const CardsBlocos = () => {

    const { allBlocos, getAllBlocos, loading, modalRemover, handleModalRemover, deleteBloco,
        editarBloco, openCadastro, handleOpenCadastro } = useModalBlocoHook();
    const [itemSelecionado, setItemSelecionado] = useState({})

    useEffect(() => {
        getAllBlocos()
    }, [])

    return (
        <>

            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>

                {allBlocos.map((item) => (
                    <Grid size={{ md: 6, xs: 12 }} sx={{ border: '2px solid #62acb5', p: 2, bgcolor: '#fff', borderRadius: 5 }}>

                        <Chip label={`Código: ${item.id}`} sx={{ mb: 2, fontWeight: 'bold' }} />

                        <Divider />

                        <Grid size={{ md: 12, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            <Grid size={{ md: 9, xs: 12 }} sx={{ display: 'flex' }}>
                                <Typography sx={{ fontSize: 20, fontWeight: 'bold', mt: 2 }}>
                                    {item.nome}
                                </Typography>
                            </Grid>

                            <Grid size={{ md: 3, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row' }}>
                                <IconButton onClick={() => (handleOpenCadastro(), setItemSelecionado(item))} >
                                    <EditIcon sx={{ color: '#141259' }} />
                                </IconButton>
                                <IconButton onClick={() => (handleModalRemover(), setItemSelecionado(item))} >
                                    <DeleteIcon sx={{ color: '#d46441' }} />
                                </IconButton>
                            </Grid>
                        </Grid>

                    </Grid>
                ))}

                {openCadastro &&
                    <ModalEdicao open={openCadastro} handleOpen={handleOpenCadastro}
                        item={itemSelecionado} editarBloco={editarBloco} />
                }

                {modalRemover &&
                    <AlertRemove open={modalRemover} onClose={handleModalRemover}
                        item={itemSelecionado} deleteBloco={deleteBloco} />
                }

                <Toaster />
            </Grid>

        </>
    )
}

export default CardsBlocos
