import { Typography } from '@mui/material'
import AdicionarRegras from './components/AdicionarRegras'
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
