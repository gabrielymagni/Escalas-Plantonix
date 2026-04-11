import { Grid, Typography } from '@mui/material'
import AdicionarRegras from './components/AdicionarRegras'
import ModalEditar, { retornaRegras } from './components/ModalEditar'
import useModalRegras from './hooks/useModalRegras';

const Regras = () => {

    const { open, handleOpen, } = useModalRegras();

    return (
        <>
            <Typography height={'33px'} sx={{ fontSize: '22px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Regras
            </Typography>


            <AdicionarRegras />

            <button onClick={() => handleOpen()}>abre editar</button>
            
            {open &&
                <ModalEditar open={open} handleOpen={handleOpen} info={retornaRegras[0]} />
            }

        </>
    )
}

export default Regras
