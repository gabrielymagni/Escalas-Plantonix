import React, { useState } from 'react'

const useControlarEscala = () => {

    const [buttonEditar, setButtonEditar] = useState(true);
    const [open, setOpen] = useState(false);

    const liberaEditar = (evento, blocos) => {
        setButtonEditar(false)
    }

    const salvaAlteracao = () => {
        setButtonEditar(true)
    }

    const handleOpen = () => {
        setOpen(prev => !prev);
    }

    return {
        buttonEditar, open, liberaEditar, salvaAlteracao, handleOpen
    }
}

export default useControlarEscala
