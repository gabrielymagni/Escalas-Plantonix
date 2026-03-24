import { useState } from "react"

const useModalBlocoHook = () => {

    const [openCadastro, setOpenCadastro] = useState(false);

    const handleOpenCadastro = () => {
        setOpenCadastro((prev) => !prev);
    }

    const handleSubmit = (evento) => {
        evento.preventDefault();

        const dados = new FormData(evento.target);
        const bloco = dados.get("bloco");
        const quant_pessoas = dados.get("quant_pessoas");

        const payload = {
            bloco: bloco,
            quant_pessoas: quant_pessoas
        }
        console.log("payload", payload)
    }

    return {
        openCadastro, handleOpenCadastro, handleSubmit
    }
}

export default useModalBlocoHook
