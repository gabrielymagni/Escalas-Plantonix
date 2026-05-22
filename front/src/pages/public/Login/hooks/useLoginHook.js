import { useState } from "react"
import api from "../../../../services/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const useLoginHook = () => {

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (evento) => {
        evento.preventDefault()
        setLoading(true)

        const dados = new FormData(evento.target)
        const payload = {
            email: dados.get('email'),
            password: dados.get('password'),
        }

        try {
            const response = await api.post('/login', payload)
            if (response.status === 200) {
                localStorage.setItem('access_token', response.data.access_token)
                localStorage.setItem('funcionario', JSON.stringify(response.data.funcionario))
                toast.success('Login realizado com sucesso!', {
                    style: { background: '#227212', color: 'white' }
                })
                navigate('/private/cadastroBloco')
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('E-mail ou senha inválidos.', {
                    style: { background: '#c0392b', color: 'white' }
                })
            } else {
                toast.error('Erro ao conectar com o servidor.', {
                    style: { background: '#c0392b', color: 'white' }
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, showPassword, setShowPassword, handleLogin }
}

export default useLoginHook
