import { useState } from 'react'
import { getColumnsFuncionario, getRowsFuncionario } from '../components/ColunasFuncionarios';

const useFuncionarioHook = () => {

    const rows = getRowsFuncionario();
    const [infoLinha, setInfoLinha] = useState();
    const [openModal, setOpenModal] = useState(false);
    
    const handleModal = (row) => {
        setInfoLinha(row)
        setOpenModal(true)
        console.log("item", row)
    }

    const columns = getColumnsFuncionario(handleModal);
    
    const handleCloseModal = () => {
        setOpenModal(false);
    }
    
    return {
        rows, columns, infoLinha, openModal, handleCloseModal
    }
}

export default useFuncionarioHook
