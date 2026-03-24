import { Chip, Divider, Grid, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const CardsBlocos = () => {

    return (
        <>
            <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                {simulaDadosBloco.map((item) => (
                    <Grid size={{ md: 6, xs: 12 }} sx={{ border: '2px solid #62acb5', p: 2, bgcolor: '#fff', borderRadius: 5 }}>

                        <Chip label={`Código: ${item.id}`} />

                        <Grid size={{ md: 12, xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 20, fontWeight: 'bold', mt: 2 }}>
                                {item.bloco}
                            </Typography>

                            <Grid size={{ md: 2, xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <IconButton>
                                    <DeleteIcon sx={{ color: '#d46441' }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Divider />

                        <Typography sx={{ fontSize: 16, mt: 2 }}>
                            Quantidade de funcionários: {item.quant_pessoas}
                        </Typography>


                    </Grid>
                ))}
            </Grid>

            
        </>
    )
}

export default CardsBlocos

export const simulaDadosBloco = [
    {
        id: 1,
        bloco: 'Cirúrgico',
        quant_pessoas: 2,
    },
    {
        id: 2,
        bloco: 'Maternidade',
        quant_pessoas: 3,
    },
    {
        id: 3,
        bloco: 'Clínica',
        quant_pessoas: 2,
    },
    {
        id: 4,
        bloco: 'Ambulatório',
        quant_pessoas: 1,
    },
]