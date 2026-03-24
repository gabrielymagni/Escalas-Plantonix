import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddHomeIcon from '@mui/icons-material/AddHome';
import FeedIcon from '@mui/icons-material/Feed';

export const RoutesSidebar = [
    {
        name: "Blocos",
        path: "/private/cadastroBloco",
        divider: true,
        icon: <AddHomeIcon />,
        text_divider: "Cadastros"
    },
    {
        name: "Funcionários",
        path: "/private/cadastroFuncionario",
        divider: false,
        icon: <PersonAddIcon />,
        text_divider: " "
    },
    // {
    //     name: "Regras",
    //     path: "/private/cadastroRegras",
    //     divider: false,
    //     icon: <FeedIcon />,
    //     text_divider: " "
    // },
];