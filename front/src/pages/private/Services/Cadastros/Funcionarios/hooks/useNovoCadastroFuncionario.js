import { useState } from "react"
import { simulaDadosBloco } from "../../Blocos/components/CardsBlocos";

const useNovoCadastroFuncionario = () => {

    const [openModalCadastro, setOpenModalCdastro] = useState(false);
    const [rankingBlocos, setRankingBlocos] = useState([]);
    console.log("rankingBlocos", rankingBlocos)
    const handleModalCadastro = () => {
        setOpenModalCdastro(prev => !prev);
    }


    const handleSubmit = (evento) => {
        console.log("evento", evento)
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const nome = dados.get('nome')
        const email = dados.get('email')
        const coren = dados.get('coren')
        const ordem = dados.get('ordem')
        console.log("ordem", ordem)

        const payload = {
            nome: nome,
            email: email,
            coren: coren, 
            blocos: [
                rankingBlocos.map((item, index) => {
                    return {
                        id_bloco: item.id,
                        ordem: index + 1
                    }
                })
            ]
        }

        console.log("payload", payload)
        //chama api pra enviar os dados 
        handleCloseModal()
    }

    const handleBlocosRanking = (index, newValue) => {
        setRankingBlocos((prev) => {
            const novaLista = [...prev];
            novaLista[index] = newValue;
            console.log("novaLista", novaLista)
            return novaLista;
        })
    }

    const getOptionsFiltradas = (index) => {
        return simulaDadosBloco.filter((option) => {
            return !rankingBlocos.some(
                (item, i) => i !== index && item?.bloco === option.bloco
            );
        });
    };


    return {
        openModalCadastro, handleModalCadastro, handleSubmit, handleBlocosRanking, getOptionsFiltradas, rankingBlocos
    }
}

export default useNovoCadastroFuncionario
