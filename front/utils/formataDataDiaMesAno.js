export const formataDataDiaMesAno = (data) => {
    if (!data) return;

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}


export function formatarDia(data) {
  return data.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit"
  });
}

export function formatarMes(data) {
  return data.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });
}
