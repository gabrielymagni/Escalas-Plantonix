import { useState } from "react"
import axios from "axios";
import { turnosDisponiveis } from "../components/ModalCadastro";

const useNovoCadastroFuncionario = () => {
    const [openModalCadastro, setOpenModalCdastro] = useState(false);

    const handleModalCadastro = () => {
        setOpenModalCdastro(prev => !prev);
    }

    const handleSubmit = async (evento, ranking) => {
        console.log("evento", evento)
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const nome = dados.get('nome')
        const email = dados.get('email')
        const coren = dados.get('coren')
        const data_contratacao = dados.get('data_contratacao')
        const cargo = dados.get('cargo')
        const tipo_escala = dados.get('tipo_escala')
        const turno = dados.get('turno')
        const turnoAjustado = turnosDisponiveis(tipo_escala).find(item => item.turno === turno)
        console.log("turnoAjusta", turnoAjustado)

        const payload = {
            nome: nome,
            email: email,
            coren: coren,
            turno: turnoAjustado.id,
            tipo_escala: tipo_escala,
            data_contratacao: data_contratacao,
            cargo: cargo,
            blocos: ranking.map((item, index) => {
                return {
                    id_bloco: item.id,
                    ordem: index + 1
                }
            })
        }
        console.log("payload", payload)

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/funcionario`, payload);
            if (response.status === 201) {
                console.log("response", response)
                alert("Novo funcionário cadastrado com sucesso! ✅")
                window.location.reload()
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }

    return {
        openModalCadastro, handleModalCadastro, handleSubmit,
    }
}

export default useNovoCadastroFuncionario
