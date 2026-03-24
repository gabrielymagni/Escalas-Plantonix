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
        const quant_pessoa = dados.get("quant_pessoa");
        console.log("bloco", bloco)
    }

    return {
        openCadastro, handleOpenCadastro, handleSubmit
    }
}

export default useModalBlocoHook
