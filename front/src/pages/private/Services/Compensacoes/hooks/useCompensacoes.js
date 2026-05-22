import { useState, useCallback } from 'react';
import api from '../../../../../services/api';

export default function useCompensacoes() {
    const [compensacoes, setCompensacoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('pendente');

    const fetchCompensacoes = useCallback(async (status = filtroStatus) => {
        setLoading(true);
        try {
            const params = status !== 'todas' ? { status } : {};
            const response = await api.get('/compensacoes', { params });
            if (response.status === 200) setCompensacoes(response.data.data);
        } catch {
            // silencioso
        } finally {
            setLoading(false);
        }
    }, [filtroStatus]);

    const resolverCompensacao = async (id) => {
        try {
            await api.put(`/compensacoes/${id}/resolver`);
            if (filtroStatus === 'pendente') {
                setCompensacoes(prev => prev.filter(c => c.id !== id));
            } else {
                setCompensacoes(prev =>
                    prev.map(c => c.id === id ? { ...c, status: 'resolvida' } : c)
                );
            }
        } catch {
            // silencioso
        }
    };

    const handleFiltro = (novoStatus) => {
        setFiltroStatus(novoStatus);
        fetchCompensacoes(novoStatus);
    };

    return {
        compensacoes,
        loading,
        filtroStatus,
        fetchCompensacoes,
        resolverCompensacao,
        handleFiltro,
    };
}
