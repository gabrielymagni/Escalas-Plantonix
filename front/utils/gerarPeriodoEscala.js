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