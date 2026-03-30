export const formataDataDiaMesAno = (data) => {
    if (!data) return;

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}