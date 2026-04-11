import { Grid, Typography } from '@mui/material'
import AdicionarRegras from './components/AdicionarRegras'
import ModalEditar, { retornaRegras } from './components/ModalEditar'
import useModalRegras from './hooks/useModalRegras';
import TabelaRegras from './components/TabelaRegras';

const Regras = () => {

    return (
        <>
            <Typography height={'33px'} sx={{ fontSize: '22px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Regras
            </Typography>

            <AdicionarRegras />

            <TabelaRegras /> 
        </>
    )
}

export default Regras
