import { Typography } from '@mui/material'
import TableBlocos from './components/TableBlocos'

const Bloco = () => {
    return (
        <>
            <Typography height={'33px'} sx={{ fontSize: '22px', color: '#222059', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Blocos
            </Typography>

            <TableBlocos />
        </>
    )
}

export default Bloco
