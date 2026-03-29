import { useState } from 'react'
import { getColumnsFuncionario, getRowsFuncionario } from '../components/ColunasFuncionarios';
import axios from 'axios';

const useFuncionarioHook = () => {

    const [infoLinha, setInfoLinha] = useState();
    const [openModal, setOpenModal] = useState(false);

    const [allFuncionarios, setAllFuncionarios] = useState([]);

    const getAllFuncionarios = async () => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/funcionario`);
            if (response.status === 200) {
                console.log("response", response)
                setAllFuncionarios(response.data);
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

    const deleteFuncionario = async (id) => {

        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/funcionario/${id}`);
            if (response.status === 200) {
                console.log("response", response)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }

    }


    const rows = getRowsFuncionario(allFuncionarios);
    const columns = getColumnsFuncionario(handleModal, deleteFuncionario);

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const editarFuncionario = async (evento, id) => {
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
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/funcionario/${id}`, payload);
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
        rows, columns, infoLinha, openModal, handleCloseModal, allFuncionarios, getAllFuncionarios, editarFuncionario
    }
}

export default useFuncionarioHook
