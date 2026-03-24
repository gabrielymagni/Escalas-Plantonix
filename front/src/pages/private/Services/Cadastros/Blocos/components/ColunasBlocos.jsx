export const getColumnsBloco = () => [
    { id: "id", label: "ID", minWidth: 100 },
    { id: "bloco", label: "Bloco", minWidth: 50 }
]


export const getRowsBloco = () =>
    simulaDados.map((item) => ({
        id: item.id,
        bloco: item.bloco
    }))


export const simulaDados = [
    {
        id: 1,
        bloco: 'Cirúrgico'
    },
    {
        id: 1,
        bloco: 'Maternidade'
    },
    {
        id: 1,
        bloco: 'Clínica'
    },
    {
        id: 1,
        bloco: 'Ambulatório'
    },
]