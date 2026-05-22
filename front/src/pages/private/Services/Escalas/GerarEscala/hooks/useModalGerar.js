import { useState } from "react";
import { gerarPeriodos } from "../../../../../../../utils/gerarPeriodoEscala";
import api from "../../../../../../services/api";
import { toast } from "sonner";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const useModalGerar = () => {

    const periodos = gerarPeriodos();
    const [loading, setLoading] = useState(false);


    const submitGerarEscala = async (evento) => {
        evento.preventDefault();
        setLoading(true)

        const dados = new FormData(evento.target)
        const [inicio, fim] = dados.get("periodo").split(" - ");

        const payload = {
            inicio: dayjs(inicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
            fim: dayjs(fim, "DD/MM/YYYY").format("YYYY-MM-DD"),
        }

        console.log("payload", payload)

        try {
            await api.post(`/escala`, payload);
            toast.success("Escala gerada com sucesso! ✅", {
                style: { background: "#227212", color: "white" }
            });
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error("Erro ao gerar escala.");
        } finally {
            setLoading(false);
        }
    }


    return {
        submitGerarEscala, loading, periodos
    }
}

export default useModalGerar
