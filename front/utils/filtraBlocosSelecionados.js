export const getOptionsFiltradas = (index, allBlocos, ranking) => {
    return allBlocos.filter((option) => {
        return !ranking.some(
            (item, i) => i !== index && item?.nome === option.nome
        );
    });
};