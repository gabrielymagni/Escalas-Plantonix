import { createBrowserRouter } from "react-router-dom";
import BaseAdmin from "../pages/private/base/BaseAdmin";
import Bloco from "../pages/private/Services/Cadastros/Blocos/Bloco";
import Funcionario from "../pages/private/Services/Cadastros/Funcionarios/Funcionario";
import Regras from "../pages/private/Services/Cadastros/Regras/Regras";
import Login from "../pages/public/Login/Login";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <BaseAdmin />
    },
    {
        path: '*',
        element: <BaseAdmin />
    },
    {
        path: '/private',
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
        ]
    }
])