import { useState, useEffect } from 'react';
import axios from 'axios';

const useHistoricoEscala = () => {
    const [historico, setHistorico] = useState([]);
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [dadosEscala, setDadosEscala] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);

    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/escala/historico`);
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
    };

    const filtrarPorBloco = async (evento, allBlocos) => {
        evento.preventDefault();
        if (!escalaSelecionada) return;

        const dados = new FormData(evento.target);
        const bloco = allBlocos.find(item => item.nome === dados.get('bloco'));

        setLoadingDetalhe(true);
        try {
            const url = bloco
                ? `${import.meta.env.VITE_API_URL}/escala/${escalaSelecionada.id}/detalhes/${bloco.id}`
                : `${import.meta.env.VITE_API_URL}/escala/${escalaSelecionada.id}/detalhes`;
            const response = await axios.get(url);
            setDadosEscala(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar escala', error);
        } finally {
            setLoadingDetalhe(false);
        }
    };

    const voltarParaLista = () => {
        setEscalaSelecionada(null);
        setDadosEscala([]);
    };

    return {
        historico,
        escalaSelecionada,
        dadosEscala,
        loading,
        loadingDetalhe,
        selecionarEscala,
        filtrarPorBloco,
        voltarParaLista,
    };
};

export default useHistoricoEscala;
