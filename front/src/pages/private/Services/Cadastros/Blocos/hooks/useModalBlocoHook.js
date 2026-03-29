import { useState } from "react"
import axios from "axios";


const useModalBlocoHook = () => {

    const [openCadastro, setOpenCadastro] = useState(false);
    const [allBlocos, setAllBlocos] = useState([]);

    const handleOpenCadastro = () => {
        setOpenCadastro((prev) => !prev);
    }

    const getAllBlocos = async () => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/bloco`);
            if (response.status === 200) {
                console.log("response", response)
                setAllBlocos(response.data);
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }

    }

    const deleteBloco = async (id) => {

        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/bloco/${id}`);
            if (response.status === 200) {
                console.log("response", response)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }

    }

    const handleSubmit = async (evento) => {
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const bloco = dados.get("nome");

        const payload = {
            nome: bloco,
        }
        console.log("payload", payload)

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/bloco`, payload);
            if (response.status === 200) {
                console.log("response", response)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }

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
        openCadastro, handleOpenCadastro, handleSubmit, getAllBlocos, allBlocos, deleteBloco, editarBloco
    }
}

export default useModalBlocoHook
