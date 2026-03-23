import { createBrowserRouter } from "react-router-dom";
import BaseAdmin from "../pages/private/base/BaseAdmin";
import Bloco from "../pages/private/Services/Cadastros/Bloco.jsx";
import Funcionario from "../pages/private/Services/Cadastros/Funcionario.jsx";
import Regras from "../pages/private/Services/Cadastros/Regras.jsx";

export const router = createBrowserRouter([
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