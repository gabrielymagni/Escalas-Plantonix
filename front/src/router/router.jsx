import { createBrowserRouter } from "react-router-dom";
import BaseAdmin from "../pages/private/base/BaseAdmin";
import Bloco from "../pages/private/Services/Cadastros/Blocos/Bloco";
import Funcionario from "../pages/private/Services/Cadastros/Funcionarios/Funcionario";

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
            // {
            //     path: 'cadastroRegras',
            //     element: <Regras />,
            // }, 
        ]
    }
])