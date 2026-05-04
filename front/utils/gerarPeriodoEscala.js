import dayjs from "dayjs";


export function gerarPeriodo16a15(data) {
  const ano = data.getFullYear();
  const mes = data.getMonth();

  const inicio = new Date(ano, mes, 16);
  const fim = new Date(ano, mes + 1, 15);

  const diasNoPeriodo =
    Math.floor(
      (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  return { inicio, diasNoPeriodo };
}

export function getPeriodoAtual() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const dia = hoje.getDate();

  // se ainda não chegou dia 16,
  // o período começou no mês anterior
  if (dia <= 15) {
    return new Date(ano, mes - 1, 1);
  }

  return new Date(ano, mes, 1);
}

export function formatarPeriodo(inicio, diasNoPeriodo) {

  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + diasNoPeriodo - 1);

  const opcoes = { month: "short" };

  const inicioStr = inicio.toLocaleDateString("pt-BR", {
    day: "2-digit",
    ...opcoes
  });

  const fimStr = fim.toLocaleDateString("pt-BR", {
    day: "2-digit",
    ...opcoes,
    year: "numeric"
  });

  return `${inicioStr} — ${fimStr}`;
}


export function gerarPeriodos(qtd = 12) {
  const hoje = dayjs();
  const periodos = [];

  for (let i = -2; i < qtd; i++) {
    const inicio = hoje.add(i, "month").date(16);
    const fim = inicio.add(1, "month").date(15);

    periodos.push({
      label: `${inicio.format("DD/MM/YYYY")} - ${fim.format("DD/MM/YYYY")}`,
      inicio: inicio.format("YYYY-MM-DD"),
      fim: fim.format("YYYY-MM-DD"),
    });
  }

  return periodos;
}