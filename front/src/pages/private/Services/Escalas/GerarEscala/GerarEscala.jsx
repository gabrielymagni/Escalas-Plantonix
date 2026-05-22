import { Backdrop, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import useGerarEscala from "./hooks/useGerarEscala";
import ModalGerarEscala from "./components/ModalGerarEscala";
import useControlarEscala from "./hooks/useControlarEscala";
import FiltraBlocos from "./components/FiltraBlocos";
import TabelaEscala from "./components/TabelaEscala";
import usePrintEscala from "./hooks/usePrintEscala";

export default function GerarEscala() {

    const { dadosEscala, filtraBloco, loading, handleChange, submitSalvar, mesAtual, proximoMes, mesAnterior, fetchLatestEscala, selectedBloco, setSelectedBloco } = useGerarEscala();
    const { open, handleOpen } = useControlarEscala()
    const { printTodosOsBlocos } = usePrintEscala()
    const [allBlocos, setAllBlocos] = useState([]);

    const handleGerarSuccess = () => {
        handleOpen();
        const bloco = allBlocos.find(b => b.id === 1) ?? allBlocos[0];
        if (bloco) fetchLatestEscala(bloco.id, bloco);
    };

    const handlePrint = () => printTodosOsBlocos(allBlocos, mesAtual)

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

            <FiltraBlocos
                filtraBloco={filtraBloco}
                handleOpen={handleOpen}
                selectedBloco={selectedBloco}
                onBlocoChange={setSelectedBloco}
                onBlocosLoaded={setAllBlocos}
                handlePrint={handlePrint}
            />

            {(!loading && dadosEscala.length > 0) &&
                <TabelaEscala dadosEscala={dadosEscala} handleChange={handleChange}
                    submitSalvar={submitSalvar} mesAtual={mesAtual}
                    proximoMes={proximoMes} mesAnterior={mesAnterior} />
            }

            <ModalGerarEscala open={open} handleOpen={handleOpen} onSuccess={handleGerarSuccess} />
        </>
    );
}






