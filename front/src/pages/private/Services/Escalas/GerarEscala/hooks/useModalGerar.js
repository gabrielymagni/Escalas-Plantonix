import { useState } from "react";
import { gerarPeriodos } from "../../../../../../../utils/gerarPeriodoEscala";
import axios from "axios";
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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/escala`, payload);
            if (response.status === 200) {
                console.log("response", response)
                setLoading(false)
                toast.success("Escala gerada com sucesso! ✅", {
                    style: {
                        background: "#227212",
                        color: "white"
                    }
                })

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                console.log("erro ao chamar api")
            }
        } catch (error) {
            console.error('resposta indisponível', error)
        }
    }


    return {
        submitGerarEscala, loading, periodos
    }
}

export default useModalGerar
