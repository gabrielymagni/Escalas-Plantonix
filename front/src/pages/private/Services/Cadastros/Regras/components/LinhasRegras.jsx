export const getRowsRegras = (dados) =>
    dados.map((item) => ({
        id: item.id,
        tipo_profissional: item.tipo_profissional,
        tipo_dia: item.tipo_dia,
        blocos: item.blocos,
    }))