import { toast } from 'sonner'
import api from '../../../../../../services/api'
import { gerarPeriodo16a15, formatarPeriodo } from '../../../../../../../utils/gerarPeriodoEscala'

const TURNO_COLOR = {
    MT: '#a2ff9a',
    M: '#f4ff95',
    T: '#ffbf8b',
    N: '#bae0ff',
    F: '#b8b8b8',
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const usePrintEscala = () => {

    const printTodosOsBlocos = async (allBlocos, mesAtual) => {
        if (!allBlocos?.length) {
            toast.error('Nenhum bloco cadastrado para impressão.')
            return
        }

        const toastId = toast.loading('Preparando impressão...')

        const results = await Promise.allSettled(
            allBlocos.map(bloco =>
                api.get(`/escala/${bloco.id}`).then(r => ({ bloco, dados: r.data.data }))
            )
        )

        toast.dismiss(toastId)

        const escalas = results
            .filter(r => r.status === 'fulfilled' && r.value.dados.length > 0)
            .map(r => r.value)

        if (!escalas.length) {
            toast.error('Nenhum bloco possui escala gerada no momento.')
            return
        }

        const { inicio, diasNoPeriodo } = gerarPeriodo16a15(mesAtual)
        const periodo = formatarPeriodo(inicio, diasNoPeriodo)

        const dias = Array.from({ length: diasNoPeriodo }, (_, i) => {
            const d = new Date(inicio)
            d.setDate(inicio.getDate() + i)
            return d
        })

        const getTurno = (prof, dataStr) => {
            const dia = prof.dias.find(d => d.data === dataStr)
            return dia?.turno || ''
        }

        const renderPagina = ({ bloco, dados }) => `
            <div class="bloco-page">
                <h2>${bloco.nome}</h2>
                <p class="periodo">${periodo}</p>
                <table>
                    <thead>
                        <tr>
                            <th class="col-nome">Profissional</th>
                            ${dias.map(d =>
            `<th>${d.getDate()}/${d.getMonth() + 1}<br/>${WEEKDAYS[d.getDay()]}</th>`
        ).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${dados.map(prof => `
                            <tr>
                                <td class="col-nome">${prof.nome}</td>
                                ${dias.map(d => {
            const dataStr = d.toISOString().slice(0, 10)
            const turno = getTurno(prof, dataStr)
            const bg = TURNO_COLOR[turno] ?? 'transparent'
            return `<td style="background:${bg};-webkit-print-color-adjust:exact;print-color-adjust:exact"><b>${turno || '-'}</b></td>`
        }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Escalas — ${periodo}</title>
    <style>
        @page { size: landscape; margin: 10mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { font-family: Arial, sans-serif; font-size: 9px; }

        .bloco-page { page-break-after: always; }
        .bloco-page:last-child { page-break-after: avoid; }

        h2 { font-size: 15px; color: #222059; text-align: center; margin-bottom: 4px; font-weight: bold; }
        .periodo { text-align: center; font-size: 11px; color: #555; margin-bottom: 8px; }

        table { width: 100%; border-collapse: collapse; }
        th, td {
            border: 1px solid #50b5ae;
            padding: 4px 2px;
            text-align: center;
        }
        th {
            background-color: #e8f7f6;
            font-weight: bold;
            font-size: 8px;
            line-height: 1.4;
            white-space: nowrap;
        }
        td { font-size: 9px; font-weight: bold; }
        .col-nome {
            width: 100px;
            max-width: 120px;
            text-align: left;
            background-color: #f3f3f3;
            padding-left: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        th.col-nome { font-size: 9px; }
    </style>
</head>
<body>
    ${escalas.map(renderPagina).join('')}
</body>
</html>`

        const win = window.open('', '_blank')
        if (!win) {
            toast.error('Popup bloqueado pelo navegador. Permita popups para este site e tente novamente.')
            return
        }
        win.document.write(html)
        win.document.close()
        win.focus()
        setTimeout(() => win.print(), 500)
    }

    return { printTodosOsBlocos }
}

export default usePrintEscala
