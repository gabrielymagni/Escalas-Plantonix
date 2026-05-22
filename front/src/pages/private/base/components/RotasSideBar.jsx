import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddHomeIcon from '@mui/icons-material/AddHome';
import FeedIcon from '@mui/icons-material/Feed';
import HistoryIcon from '@mui/icons-material/History';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

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
    {
        name: "Regras",
        path: "/private/cadastroRegras",
        divider: false,
        icon: <FeedIcon />,
        text_divider: " "
    },
    {
        name: "Gerar escalas",
        path: "/private/gerarEscala",
        divider: true,
        icon: <FeedIcon />,
        text_divider: "Escalas"
    },
    {
        name: "Histórico",
        path: "/private/historicoEscala",
        divider: false,
        icon: <HistoryIcon />,
        text_divider: " "
    },
    {
        name: "Compensações",
        path: "/private/compensacoes",
        divider: false,
        icon: <EventAvailableIcon />,
        text_divider: " "
    },
];