import { useState } from "react"
import api from "../../../../../../services/api";
import { toast } from "sonner";


const useModalBlocoHook = () => {

    const [openCadastro, setOpenCadastro] = useState(false);
    const [modalRemover, setModalRemover] = useState(false);
    const [allBlocos, setAllBlocos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpenCadastro = () => {
        setOpenCadastro((prev) => !prev);
    }

    const handleModalRemover = () => {
        setModalRemover((prev) => !prev);
    }

    const getAllBlocos = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/bloco`);
            if (response.status === 200) {
                setAllBlocos(response.data);
                setLoading(false)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }

    const deleteBloco = async (id) => {
        setLoading(true)

        try {
            const response = await api.delete(`/bloco/${id}`);
            if (response.status === 204) {
                setModalRemover(false);
                getAllBlocos()
                toast.success("Bloco removido com sucesso! ✅", {
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

    const cadastrarSubmit = async (evento) => {
        evento.preventDefault();
        setLoading(true);

        const dados = new FormData(evento.target);
        const bloco = dados.get("nome");

        const payload = {
            nome: bloco,
        }

        try {
            const response = await api.post(`/bloco`, payload);
            if (response.status === 201) {
                console.log("response", response)
                toast.success("Novo bloco adicionado! ✅", {
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

    const editarBloco = async (evento, id) => {
        evento.preventDefault();
        setLoading(true)

        const dados = new FormData(evento.target);
        const bloco = dados.get("nome");

        const payload = {
            nome: bloco,
        }

        try {
            const response = await api.put(`/bloco/${id}`, payload);
            if (response.status === 200) {
                console.log("response", response)
                setOpenCadastro(false);
                getAllBlocos()
                toast.success("Bloco editado com sucesso! ✅", {
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


    return {
        openCadastro, handleOpenCadastro, cadastrarSubmit, getAllBlocos, allBlocos,
        deleteBloco, editarBloco, loading, modalRemover, handleModalRemover
    }
}

export default useModalBlocoHook
