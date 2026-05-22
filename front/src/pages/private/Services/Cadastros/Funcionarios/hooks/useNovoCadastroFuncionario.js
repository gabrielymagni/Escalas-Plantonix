import { useState } from "react"
import api from "../../../../../../services/api";
import { turnosDisponiveis } from "../components/ModalCadastro";
import { toast } from "sonner";

const useNovoCadastroFuncionario = () => {
    const [openModalCadastro, setOpenModalCdastro] = useState(false);

    const handleModalCadastro = () => {
        setOpenModalCdastro(prev => !prev);
    }

    const handleSubmit = async (evento, ranking, fazPlantao = true) => {
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const nome = dados.get('nome')
        const email = dados.get('email')
        const coren = dados.get('coren')
        const data_contratacao = dados.get('data_contratacao')
        const cargo = dados.get('cargo')

        const payload = {
            nome,
            email,
            coren,
            data_contratacao,
            cargo,
            faz_plantao: fazPlantao,
            ...(fazPlantao ? (() => {
                const tipo_escala = dados.get('tipo_escala');
                const turno = dados.get('turno');
                const turnoAjustado = turnosDisponiveis(tipo_escala).find(item => item.turno === turno);
                return {
                    turno: turnoAjustado?.id ?? null,
                    tipo_escala,
                    blocos: ranking.map((item, index) => ({ id_bloco: item.id, ordem: index + 1 }))
                };
            })() : { turno: null, tipo_escala: null, blocos: [] })
        }

        try {
            const response = await api.post(`/funcionario`, payload);
            if (response.status === 201) {
                console.log("response", response)
                toast.success("Novo funcionário cadastrado com sucesso! ✅", {
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
        openModalCadastro, handleModalCadastro, handleSubmit,
    }
}

export default useNovoCadastroFuncionario
