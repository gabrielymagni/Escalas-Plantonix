import { Typography } from '@mui/material'
import CardsBlocos from './components/CardsBlocos';
import AdicionarCadastro from './components/AdicionarCadastro';

const Bloco = () => {

    return (
        <>
            <Typography sx={{ fontSize: '24px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Blocos
            </Typography>

            <AdicionarCadastro />

            <CardsBlocos />
        </>
    )
}

export default Bloco
