import { useState } from 'react'
import { getColumnsFuncionario, getRowsFuncionario } from '../components/ColunasFuncionarios';
import api from '../../../../../../services/api';
import { turnosDisponiveis } from '../components/ModalCadastro';
import { toast } from 'sonner';

const useFuncionarioHook = () => {

    const [infoLinha, setInfoLinha] = useState(); //pega dados da linha selecioanda pra passar pro modal 
    const [openModal, setOpenModal] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const [rankingBlocos, setRankingBlocos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allFuncionarios, setAllFuncionarios] = useState([]);
    const [turnoSelecionado, setTurnoSelecionado] = useState(null);
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);

    const getAllFuncionarios = async () => {
        setLoading(true)

        try {
            const response = await api.get(`/funcionario`);
            if (response.status === 200) {
                setAllFuncionarios(response.data);
                setLoading(false)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }

    const handleModal = (row) => {
        setInfoLinha(row)
        setOpenModal(true)
        console.log("item", row)
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleModalRemover = (row) => {
        setOpenRemove((prev) => !prev);
        setInfoLinha(row)
    }

    const handleBlocosRanking = (indexOrArray, value) => {

        // quando vier array inteiro (edição)
        if (Array.isArray(indexOrArray)) {
            setRankingBlocos(indexOrArray);
            return;
        }

        // quando usuário escolher manualmente
        setRankingBlocos(prev => {
            const novo = [...prev];
            novo[indexOrArray] = value;
            return novo;
        });
    };

    const handleTurnos = (event, newValue) => {
        setTurnoSelecionado(newValue)
    }

    const handleEscala = (event, newValue) => {
        setEscalaSelecionada(newValue)
        setTurnoSelecionado(null)
    }

    const deleteFuncionario = async (id) => {
        setLoading(true)

        try {
            const response = await api.delete(`/funcionario/${id}`);
            if (response.status === 204) {
                console.log("response", response)
                setOpenRemove(false)
                getAllFuncionarios()
                toast.success("Funcionário removido com sucesso! ✅", {
                    style: {
                        background: "#227212",
                        color: "white"
                    }
                })
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }

    }

    const rows = getRowsFuncionario(allFuncionarios);
    const columns = getColumnsFuncionario(handleModal, handleModalRemover);

    const editarFuncionario = async (evento, id) => {
        evento.preventDefault();
        setLoading(true)

        const dados = new FormData(evento.target);
        const nome = dados.get('nome')
        const email = dados.get('email')
        const coren = dados.get('coren')
        const data_contratacao = dados.get('data_contratacao')
        const cargo = dados.get('cargo')
        const tipo_escala = dados.get('tipo_escala')
        const turno = dados.get('turno')
        const turnoAjustado = turnosDisponiveis(tipo_escala).find(item => item.turno === turno)

        const payload = {
            nome: nome,
            email: email,
            coren: coren,
            turno: turnoAjustado.id,
            tipo_escala: tipo_escala,
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
            const response = await api.put(`/funcionario/${id}`, payload);
            if (response.status === 200) {
                console.log("response", response)
                toast.success("Funcionário editado com sucesso! ✅", {
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
        rows, columns, infoLinha, openModal, handleCloseModal, allFuncionarios, deleteFuncionario,
        getAllFuncionarios, editarFuncionario, rankingBlocos, handleBlocosRanking, loading, openRemove, handleModalRemover, 
        handleTurnos, turnoSelecionado, escalaSelecionada, handleEscala, setEscalaSelecionada, setTurnoSelecionado
    }
}

export default useFuncionarioHook
