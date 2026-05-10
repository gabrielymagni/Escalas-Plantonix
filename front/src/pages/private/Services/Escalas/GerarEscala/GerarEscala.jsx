import { Backdrop, CircularProgress, Grid, Typography } from '@mui/material'
import useGerarEscala from "./hooks/useGerarEscala";
import ModalGerarEscala from "./components/ModalGerarEscala";
import useControlarEscala from "./hooks/useControlarEscala";
import FiltraBlocos from "./components/FiltraBlocos";
import TabelaEscala from "./components/TabelaEscala";

export default function GerarEscala() {

    const { dadosEscala, filtraBloco, loading, handleChange, submitSalvar } = useGerarEscala();
    const { open, handleOpen } = useControlarEscala()

    console.log("dadosEscala", dadosEscala)

    return (
        <>
            <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography sx={{
                fontSize: '24px', color: '#222059', fontWeight: 'bold',
                textAlign: 'center', mb: 2, mt: 1
            }}>
                Escalas
            </Typography>

            <FiltraBlocos filtraBloco={filtraBloco} handleOpen={handleOpen} />

            {(!loading && dadosEscala.length > 0) &&
                <TabelaEscala dadosEscala={dadosEscala} handleChange={handleChange}
                submitSalvar={submitSalvar} />
            }

            <ModalGerarEscala open={open} handleOpen={handleOpen} />
        </>
    );
}






