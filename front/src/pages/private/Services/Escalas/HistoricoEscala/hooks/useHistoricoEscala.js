import { useState, useEffect } from 'react';
import api from '../../../../../../services/api';

const useHistoricoEscala = () => {
    const [historico, setHistorico] = useState([]);
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [dadosEscala, setDadosEscala] = useState([]);
    const [deficiencias, setDeficiencias] = useState([]);
    const [afastados, setAfastados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);

    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        setLoading(true);
        try {
            const response = await api.get('/escala/historico');
            setHistorico(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar histórico', error);
        } finally {
            setLoading(false);
        }
    };

    const selecionarEscala = (escala) => {
        setEscalaSelecionada(escala);
        setDadosEscala([]);
        setDeficiencias([]);
        setAfastados([]);
    };

    const filtrarPorBloco = async (evento, allBlocos) => {
        evento.preventDefault();
        if (!escalaSelecionada) return;

        const formData = new FormData(evento.target);
        const bloco = allBlocos.find(item => item.nome === formData.get('bloco'));

        setLoadingDetalhe(true);
        try {
            const url = bloco
                ? `/escala/${escalaSelecionada.id}/detalhes/${bloco.id}`
                : `/escala/${escalaSelecionada.id}/detalhes`;
            const response = await api.get(url);
            setDadosEscala(response.data.data);
            setDeficiencias(response.data.deficiencias ?? []);
            setAfastados(response.data.afastados ?? []);
        } catch (error) {
            console.error('Erro ao carregar escala', error);
        } finally {
            setLoadingDetalhe(false);
        }
    };

    const voltarParaLista = () => {
        setEscalaSelecionada(null);
        setDadosEscala([]);
        setDeficiencias([]);
        setAfastados([]);
    };

    return {
        historico,
        escalaSelecionada,
        dadosEscala,
        deficiencias,
        afastados,
        loading,
        loadingDetalhe,
        selecionarEscala,
        filtrarPorBloco,
        voltarParaLista,
    };
};

export default useHistoricoEscala;
