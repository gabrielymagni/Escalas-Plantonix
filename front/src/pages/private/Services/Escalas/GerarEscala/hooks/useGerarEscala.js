
import { useState } from "react"
import { getPeriodoAtual } from "../../../../../../../utils/gerarPeriodoEscala";

const useGerarEscala = () => {

    const [dadosEscala, setDadosEscala] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mesAtual, setMesAtual] = useState(getPeriodoAtual());

    const filtraBloco = async (evento, blocos) => {
        evento.preventDefault();
        setLoading(true)

        const dados = new FormData(evento.target);
        console.log("regras selecionadas:", dados.get('bloco'));

        const encontraID = blocos.find(item => item.nome === dados.get('bloco'))
        console.log("encontraID", encontraID);

        setDadosEscala(mock);
        setLoading(false)

        // try {
        //     const response = await axios.put(`${import.meta.env.VITE_API_URL}/regra/${encontraID.id}`);
        //     if (response.status === 200) {
        //         console.log("response", response)
        //         toast.success("Regra editada com sucesso! ✅", {
        //             style: {
        //                 background: "#227212",
        //                 color: "white"
        //             }
        //         })

        //         setTimeout(() => {
        //             window.location.reload();
        //         }, 1500);
        //     } else {
        //         console.log("erro ao chamar api ")
        //     }
        // } catch (error) {
        //     console.error('resposta indisponível', error)
        // }
    }

    const proximoMes = () =>
        setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const mesAnterior = () =>
        setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

    //qual turno o profissina faz naquele dia 
    const getTurno = (profissional, data) => {
        // console.log("dia", data)
        const dia = profissional.dias.find(
            d => d.data === data
        );
        //retorna o turno
        // console.log("dia", dia)
        // console.log("", dia?.turno || '')
        return dia?.turno || '';
    };

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
    };

    return {
        dadosEscala, mesAtual, proximoMes, mesAnterior, handleChange, getTurno, filtraBloco, loading
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

