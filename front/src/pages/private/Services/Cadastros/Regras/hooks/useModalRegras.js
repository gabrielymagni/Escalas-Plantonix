import api from "../../../../../../services/api";
import { useState } from "react"
import { toast } from "sonner";

const useModalRegras = () => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openRemover, setOpenRemover] = useState(false);
    const [infoLinha, setInfoLinha] = useState([]);
    const [allRegras, setAllRegras] = useState([]);

    const handleOpen = (row) => {
        if (row) {
            setInfoLinha(row)
            setOpen(prev => !prev)
        } else {
            setOpen(prev => !prev)
        }

        console.log("item", row)
    }

    const handleRemover = (row) => {
        if (row) {
            setInfoLinha(row)
            setOpenRemover((prev) => !prev);
        } else {
            setOpenRemover((prev) => !prev);
        }
    }

    const getAllRegras = async () => {
        setLoading(true)

        try {
            const response = await api.get(`/regra`);
            if (response.status === 200) {
                console.log("response", response)
                setAllRegras(response.data);
                setLoading(false)
            } else {
                console.log("erro ao chamar api ")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }

    const submitCadastro = async (evento, blocos) => {
        evento.preventDefault();
        console.log("CADASTRAR")

        const dados = new FormData(evento.target);

        const encontraBlocos = blocos.map(item => ({
            bloco_id: item.id,
            qtd_manha: dados.get(`${item.nome} - manha`),
            qtd_tarde: dados.get(`${item.nome} - tarde`),
            qtd_noite: dados.get(`${item.nome} - noite`),
        }))
        console.log("encontraBlocos", encontraBlocos)

        const encontraTipoDia = tipoDias.find(item => item.tipo === dados.get('tipo_dia'))
        console.log("encontraTipoDia", encontraTipoDia)


        const payload = {
            tipo_profissional: dados.get('tipo_profissional'),
            tipo_dia: encontraTipoDia.id,
            blocos: encontraBlocos
        }
        console.log("payload", payload)

        try {
            const response = await api.post(`/regra`, payload);
            if (response.status === 201) {
                console.log("response", response)
                toast.success("Nova regra cadastrada com sucesso! ✅", {
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

    const editarRegra = async (evento, blocos, id) => {
        evento.preventDefault();
        console.log("EDITAR")

        const dados = new FormData(evento.target);

        const encontraBlocos = blocos.map(item => ({
            bloco_id: item.id,
            qtd_manha: dados.get(`${item.nome} - manha`),
            qtd_tarde: dados.get(`${item.nome} - tarde`),
            qtd_noite: dados.get(`${item.nome} - noite`),
        }))
        console.log("encontraBlocos", encontraBlocos)

        const encontraTipoDia = tipoDias.find(item => item.tipo === dados.get('tipo_dia'))
        console.log("encontraTipoDia", encontraTipoDia)

        const payload = {
            tipo_profissional: dados.get('tipo_profissional'),
            tipo_dia: encontraTipoDia.id,
            blocos: encontraBlocos
        }
        console.log("payload", payload)

        try {
            const response = await api.put(`/regra/${id}`, payload);
            if (response.status === 200) {
                console.log("response", response)
                toast.success("Regra editada com sucesso! ✅", {
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

    const deleteRegra = async (id) => {

        try {
            const response = await api.delete(`/regra/${id}`);
            if (response.status === 204) {
                console.log("response", response)
                setOpenRemover(false)
                getAllRegras()
                toast.success("Regra removida com sucesso! ✅", {
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
        open, handleOpen, submitCadastro, editarRegra, deleteRegra, loading, 
        infoLinha, handleRemover, allRegras, getAllRegras, openRemover
    }
}

export default useModalRegras

export const tipoProfissional = [
    { id: 1, tipo: 'Enfermeira' },
    { id: 2, tipo: 'Técnica' },
    { id: 3, tipo: 'Gestor' },
]

export const tipoDias = [
    { id: 'U', tipo: 'Dia útil' },
    { id: 'I', tipo: 'Final de semana' },
]