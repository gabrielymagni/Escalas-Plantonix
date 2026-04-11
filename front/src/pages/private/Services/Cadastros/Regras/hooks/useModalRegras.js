import { useState } from "react"

const useModalRegras = () => {

    const [open, setOpen] = useState(false);
    const [listaTipoProfissional, setListaTipoProfissional] = useState([]);
    const [listaTipoDias, setListaTipoDias] = useState([]);

    const handleOpen = () => {
        setOpen(prev => !prev)
    }

    const getOpcoesDias = async () => {
        try {
            // const { status, message } = await apiTipoDias(); 

            // if (status === 200){
            setListaTipoDias(tipoDias);
            // } else {
            //     console.log('Erro: resposta inválida da API');
            // }
        } catch (error) {
            console.error('Erro: resposta inválida da API');
        }
    }

    const getOpcoesTipoProfissionais = async () => {
        try {
            // const { status, message } = await apiTipoDias(); 

            // if (status === 200){
            setListaTipoProfissional(tipoProfissional);
            // } else {
            //     console.log('Erro: resposta inválida da API');
            // }
        } catch (error) {
            console.error('Erro: resposta inválida da API');
        }
    }

    const submitCadastro = (evento, blocos) => {
        evento.preventDefault();
        console.log("CADASTRAR")

        const dados = new FormData(evento.target);

        const encontraBlocos = blocos.map(item => ({
            bloco: item.nome,
            manha: dados.get(`${item.nome} - manha`),
            tarde: dados.get(`${item.nome} - tarde`),
            noite: dados.get(`${item.nome} - noite`),
        }))
        console.log("encontraBlocos", encontraBlocos)

        const payload = {
            tipo_profissional: dados.get('tipo_profissional'),
            tipo_dia: dados.get('tipo_dias'),
            info_blocos: encontraBlocos
        }
        console.log("payload", payload)
    }


    const editarRegra = async (evento, blocos, id) => {
        evento.preventDefault();
        console.log("EDITAR")

        const dados = new FormData(evento.target);

        const encontraBlocos = blocos.map(item => ({
            bloco: item.bloco,
            manha: dados.get(`${item.bloco} - manha`),
            tarde: dados.get(`${item.bloco} - tarde`),
            noite: dados.get(`${item.bloco} - noite`),
        }))
        console.log("encontraBlocos", encontraBlocos)

        const payload = {
            id: id,
            tipo_profissional: dados.get('tipo_profissional'),
            tipo_dia: dados.get('tipo_dia'),
            info_blocos: encontraBlocos
        }
        console.log("payload", payload)
    }

    const deleteRegra = async (id) => {
        // setLoading(true)

        // try {
        //     const response = await axios.delete(`${import.meta.env.VITE_API_URL}/funcionario/${id}`);
        //     if (response.status === 204) {
        //         console.log("response", response)
        //         setOpenRemove(false)
        //         getAllFuncionarios()
        //         toast.success("Funcionário removido com sucesso! ✅", {
        //             style: {
        //                 background: "#227212",
        //                 color: "white"
        //             }
        //         })
        //     } else {
        //         console.log("erro ao chamar api ")
        //     }
        // } catch (error) {
        //     console.error('resposta indisponível', error)
        // }

    }

    return {
        open, handleOpen, getOpcoesDias, getOpcoesTipoProfissionais, listaTipoDias, listaTipoProfissional, submitCadastro, editarRegra, deleteRegra
    }
}

export default useModalRegras

export const tipoProfissional = [
    { id: 1, tipo: 'Enfermeira' },
    { id: 2, tipo: 'Técnica' },
    { id: 3, tipo: 'Gestor' },
]

export const tipoDias = [
    { id: 1, tipo: 'Dia útil' },
    { id: 2, tipo: 'Final de semana' },
]