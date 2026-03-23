import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


export const RoutesSidebar = [
    {
        name: "Bloco",
        path: "/private/cadastroBloco",
        divider: true,
        icon: <AppRegistrationIcon />,
        text_divider: "Cadastros"
    },
    {
        name: "Funcionário",
        path: "/private/cadastroFuncionario",
        divider: false,
        icon: <AppRegistrationIcon />,
        text_divider: " "
    },
    {
        name: "Regras",
        path: "/private/cadastroRegras",
        divider: false,
        icon: <AppRegistrationIcon />,
        text_divider: " "
    },
];