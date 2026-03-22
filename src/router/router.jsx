import { createBrowserRouter } from "react-router-dom";
import BaseAdmin from "../pages/private/base/BaseAdmin";
import Teste from "../pages/private/Services/Cadastros/Teste";

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
            // {
            //     path: 'cadastros',
            //     element: <Teste />,
            // }
        ]
    }
])