
import { useState } from "react"
import moment from "../../../../../../../utils/moment";

const useGerarEscala = () => {

    const [dadosEscala, setDadosEscala] = useState();
    const [semanaSelecionada, setSemanaSelecionada] = useState({
        inicio: moment().startOf('week').valueOf(), //O início da semana atual em milissegundos.
        fim: moment().endOf('week').valueOf() ////O fim da semana atual em milissegundos.
    });

    const getEscala = async () => {

        try {
            const dadosFormatados = mock.map(item => ({
                id: item.id,
                group: item.pessoa,
                title: item.title,
                // Transforma "2026-04-20" em milissegundos, .startOf('day') garante que comece às 00:00:00 daquela data
                start_time: moment(item.data).startOf('day').valueOf(),
                // .endOf('day') termine às 23:59:59 e preenche o quadrado
                end_time: moment(item.data).endOf('day').valueOf()
            }));
            setDadosEscala(dadosFormatados);

        } catch (error) {
            console.error('Erro ao fazer requisição', error);
        }
    }

    const handlePrev = () => {
        setSemanaSelecionada({
            inicio: moment(semanaSelecionada.inicio).subtract(1, 'week').valueOf(),
            fim: moment(semanaSelecionada.fim).subtract(1, 'week').valueOf()
        });
    };

    const handleNext = () => {
        setSemanaSelecionada({
            inicio: moment(semanaSelecionada.inicio).add(1, 'week').valueOf(),
            fim: moment(semanaSelecionada.fim).add(1, 'week').valueOf()
        });
    };

    

    return {
        getEscala, dadosEscala, semanaSelecionada, handlePrev, handleNext, setDadosEscala
    }
}

export default useGerarEscala


const mock = [
    { "id": 101, "pessoa": 29, "title": "Manhã e Tarde", "data": "2026-04-20" },
    { "id": 102, "pessoa": 30, "title": "Noite", "data": "2026-04-21" },
    { "id": 103, "pessoa": 28, "title": "Folga", "data": "2026-04-21" },
    { "id": 104, "pessoa": 30, "title": "Manhã", "data": "2026-04-22" },
    { "id": 105, "pessoa": 29, "title": "Tarde", "data": "2026-04-23" },
]