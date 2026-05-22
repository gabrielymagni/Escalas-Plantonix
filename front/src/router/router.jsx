import { createBrowserRouter, Navigate } from "react-router-dom";
import BaseAdmin from "../pages/private/base/BaseAdmin";
import Bloco from "../pages/private/Services/Cadastros/Blocos/Bloco";
import Funcionario from "../pages/private/Services/Cadastros/Funcionarios/Funcionario";
import Regras from "../pages/private/Services/Cadastros/Regras/Regras";
import Login from "../pages/public/Login/Login";
import GerarEscala from "../pages/private/Services/Escalas/GerarEscala/GerarEscala";
import PrivateRoute from "./PrivateRoute";
import HistoricoEscala from "../pages/private/Services/Escalas/HistoricoEscala/HistoricoEscala";
import Compensacoes from "../pages/private/Services/Compensacoes/Compensacoes";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/private',
        element: <PrivateRoute />,
        children: [
            {
                element: <BaseAdmin />,
                children: [
                    {
                        path: 'cadastroBloco',
                        element: <Bloco />,
                    },
                    {
                        path: 'cadastroFuncionario',
                        element: <Funcionario />,
                    },
                    {
                        path: 'cadastroRegras',
                        element: <Regras />,
                    },
                    {
                        path: 'gerarEscala',
                        element: <GerarEscala />,
                    },
                    {
                        path: 'historicoEscala',
                        element: <HistoricoEscala />,
                    },
                    {
                        path: 'compensacoes',
                        element: <Compensacoes />,
                    },
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />
    },
])
