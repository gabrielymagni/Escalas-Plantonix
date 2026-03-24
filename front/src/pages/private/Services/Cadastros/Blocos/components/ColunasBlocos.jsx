export const getColumnsBloco = () => [
    { id: "id", label: "ID", minWidth: 100 },
    { id: "bloco", label: "Bloco", minWidth: 50 }
]


export const getRowsBloco = () =>
    simulaDadosBloco.map((item) => ({
        id: item.id,
        bloco: item.bloco
    }))


export const simulaDadosBloco = [
    {
        id: 1,
        bloco: 'Cirúrgico'
    },
    {
        id: 2,
        bloco: 'Maternidade'
    },
    {
        id: 3,
        bloco: 'Clínica'
    },
    {
        id: 4,
        bloco: 'Ambulatório'
    },
]