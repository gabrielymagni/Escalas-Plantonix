
import { useState } from "react"
import { getPeriodoAtual } from "../../../../../../../utils/gerarPeriodoEscala";
import { toast } from "sonner";
import api from "../../../../../../services/api";

const useGerarEscala = () => {

    const [dadosEscala, setDadosEscala] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mesAtual, setMesAtual] = useState(getPeriodoAtual());
    const [itensAlterados, setItensAlterados] = useState([]);

    const filtraBloco = async (evento, blocos) => {
        evento.preventDefault();
        setLoading(true)

        const dados = new FormData(evento.target);
        const encontraID = blocos.find(item => item.nome === dados.get('bloco'))

        try {
            const response = await api.get(`/escala/${encontraID.id}`);
            setDadosEscala(response.data.data);
        } catch (error) {
            if (error.response?.status === 404) {
                toast.info("Nenhuma escala encontrada. Gere uma nova escala para começar.");
            } else {
                toast.error("Erro ao buscar escala.");
            }
        } finally {
            setLoading(false);
        }
    }

    const proximoMes = () =>
        setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const mesAnterior = () =>
        setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

    //qual turno o profissina faz naquele dia 
    const getTurno = (profissional, data) => {
        const dia = profissional.dias.find(
            d => d.data === data
        );
       
        return dia?.turno || '';
    };

    console.log('itensAlterados', itensAlterados)

    const handleChange = (idProfissional, data, turno) => {

        setDadosEscala(prev =>
            prev.map(prof => {

                if (prof.id !== idProfissional) return prof;

                const existeDia = prof.dias.some(d => d.data === data);

                return {
                    ...prof,
                    dias: existeDia
                        ? prof.dias.map(d =>
                            d.data === data
                                ? { ...d, turno }
                                : d
                        )
                        : [...prof.dias, { data, turno }]
                };
            })
        );

        setItensAlterados(prev => {

            const profissional = dadosEscala.find(prof => prof.id === idProfissional);

            const dia = profissional?.dias.find(d => d.data === data);

            const idEscala = dia?.id_item_escala;

            const jaExiste = prev.find(item => item.id === idEscala);

            if (jaExiste) {
                return prev.map(item => item.id === idEscala ? { ...item, turno } : item);
            }

            return [
                ...prev,
                {
                    id: idEscala,
                    turno
                }
            ];
        });
    };

    const submitSalvar = async () => {

        const payload = {
            "itens": itensAlterados
        }

        console.log("payload itens", payload)

        try {
            const response = await api.put(`/escala`, payload);
            if (response.status === 200) {
                toast.success("Escala atualizada com sucesso! ✅", {
                    style: {
                        background: "#227212",
                        color: "white"
                    }
                })

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }

    return {
        dadosEscala, mesAtual, proximoMes, mesAnterior, handleChange, getTurno, filtraBloco, loading, submitSalvar
    }
}

export default useGerarEscala


const mock = [
    {
        "id": 1,
        "id_pessoa": 2,
        "nome": "Gabriely",
        "dias": [
            {
                "turno": "M",
                "data": "2026-05-03"
            },
            {
                "turno": "M",
                "data": "2026-05-04"
            }
        ]
    },
    {
        "id": 2,
        "id_pessoa": 2,
        "nome": "Maria",
        "dias": [
            {
                "turno": "T",
                "data": "2026-05-16"
            },
            {
                "turno": "T",
                "data": "2026-05-17"
            }
        ]
    },
    {
        "id": 4,
        "id_pessoa": 5,
        "nome": "Joao",
        "dias": [
            {
                "turno": "N",
                "data": "2026-05-16"
            },
            {
                "turno": "N",
                "data": "2026-05-17"
            }
        ]
    },
]


export const OpcoesEventos = [
    { id: 'M', turno: 'Manhã' },
    { id: 'T', turno: 'Tarde' },
    { id: 'MT', turno: 'Manhã e Tarde' },
    { id: 'N', turno: 'Noite' },
    { id: 'F', turno: 'Folga' },
];

