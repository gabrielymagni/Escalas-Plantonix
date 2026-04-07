import { useState } from "react"

const useModalRegras = () => {

    const [openCadastar, setOpenCadastrar] = useState(false);

    const handleOpenCadastrar = () => {
        setOpenCadastrar(prev => !prev)
    }





    return {
        openCadastar, handleOpenCadastrar
    }
}

export default useModalRegras

export const tipoProfissional = [
   { id: 1, tipo: 'enfermeira'},
   { id: 2, tipo: 'técnica'},
   { id: 3, tipo: 'gestor'},
]

export const tipoDias = [
   { id: 1, tipo: 'Dia útil'},
   { id: 2, tipo: 'Final de semana'},
]