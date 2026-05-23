import { useEffect } from 'react'
import { Typography, Backdrop, CircularProgress } from '@mui/material'
import useModalRegras from './hooks/useModalRegras'
import useModalBlocoHook from '../Blocos/hooks/useModalBlocoHook'
import AdicionarRegras from './components/AdicionarRegras'
import TabelaRegras from './components/TabelaRegras'
import ModalCadastro from './components/ModalCadastro'
import ModalEditar from './components/ModalEditar'
import AlertRemove from './components/AlertRemove'
import { getColumnsRegras } from './components/ColunaRegras'
import { getRowsRegras } from './components/LinhasRegras'

const Regras = () => {
    const { open, handleOpen, submitCadastro, editarRegra, deleteRegra,
        infoLinha, handleRemover, allRegras, getAllRegras, openRemover, loading } = useModalRegras();
    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    useEffect(() => {
        getAllRegras();
        getAllBlocos();
    }, []);

    const rows = getRowsRegras(allRegras);
    const columns = getColumnsRegras(handleOpen, handleRemover);
    const isEditing = Boolean(infoLinha?.id);

    return (
        <>
            <Typography height={'33px'} sx={{ fontSize: '22px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Regras
            </Typography>

            <AdicionarRegras handleOpen={handleOpen} />

            <TabelaRegras rows={rows} columns={columns} />

            {open && !isEditing && (
                <ModalCadastro open={open} handleOpen={handleOpen} submitCadastro={submitCadastro} allBlocos={allBlocos} />
            )}
            {open && isEditing && (
                <ModalEditar open={open} handleOpen={handleOpen} editarRegra={editarRegra} info={infoLinha} />
            )}
            {openRemover && (
                <AlertRemove open={openRemover} onClose={handleRemover} item={infoLinha} deleteRegra={deleteRegra} />
            )}

            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default Regras
