import { useState } from "react"
import { simulaDadosBloco } from "../../Blocos/components/CardsBlocos";
import axios from "axios";

const useNovoCadastroFuncionario = () => {

    const [openModalCadastro, setOpenModalCdastro] = useState(false);
    const [rankingBlocos, setRankingBlocos] = useState([]);
    const [turnoSelecionado, setTurnoSelecionado] = useState([]);
    const [escalaSelecionada, setEscalaSelecionada] = useState([]);
    console.log("rankingBlocos", rankingBlocos)
    console.log("turnoSelecionado", turnoSelecionado)
    console.log("escalaSelecionada", escalaSelecionada)

    const handleModalCadastro = () => {
        setOpenModalCdastro(prev => !prev);
    }

    const handleSubmit = async (evento) => {
        console.log("evento", evento)
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const nome = dados.get('nome')
        const email = dados.get('email')
        const coren = dados.get('coren')
        const data_contratacao = dados.get('data_contratacao')
        const cargo = dados.get('cargo')

        const payload = {
            nome: nome,
            email: email,
            coren: coren,
            turno: turnoSelecionado.id,
            tipo_escala: escalaSelecionada.tipo,
            data_contratacao: data_contratacao,
            cargo: cargo,
            blocos: rankingBlocos.map((item, index) => {
                return {
                    id_bloco: item.id,
                    ordem: index + 1
                }
            })
        }
        console.log("payload", payload)

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/funcionario`, payload);
            if (response.status === 200) {
                console.log("response", response)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }

        //chama api pra enviar os dados 
        // handleCloseModal()
    }

    const handleTurnos = (event, newValue) => {
        setTurnoSelecionado(newValue)
    }

    const handleEscala = (event, newValue) => {
        setEscalaSelecionada(newValue)
        setTurnoSelecionado([])
    }

    const handleBlocosRanking = (index, newValue) => {
        setRankingBlocos((prev) => {
            const novaLista = [...prev];
            novaLista[index] = newValue;
            console.log("novaLista", novaLista)
            return novaLista;
        })
    }

    const getOptionsFiltradas = (index, allBlocos) => {
        return allBlocos.filter((option) => {
            return !rankingBlocos.some(
                (item, i) => i !== index && item?.nome === option.nome
            );
        });
    };

    const editarBloco = async (evento, id) => {
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const bloco = dados.get("nome");

        const payload = {
            nome: bloco,
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/bloco/${id}`, payload);
            if (response.status === 200) {
                console.log("response", response)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }

    }


    return {
        openModalCadastro, handleModalCadastro, handleSubmit, handleBlocosRanking, getOptionsFiltradas, rankingBlocos, handleTurnos, turnoSelecionado, escalaSelecionada, handleEscala
    }
}

export default useNovoCadastroFuncionario
