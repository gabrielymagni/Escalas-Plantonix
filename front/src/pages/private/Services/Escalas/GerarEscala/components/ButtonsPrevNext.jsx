import { Button, Grid, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';

const ButtonsPrevNext = ({ periodo, handleNext, handlePrev, liberaEditar }) => {
    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid size={{ md: 2, xs: 1 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                <IconButton onClick={handlePrev} >
                    <ArrowBackIcon sx={{ color: '#141259', fontSize: { md: 20, xs: 18 } }} />
                </IconButton>
            </Grid>

            <Grid size={{ md: 5, xs: 10 }} >
                <Typography sx={{ color: '#141259', fontWeight: 'bold', fontSize: { md: 20, xs: 14 }, textAlign: 'center' }}>
                    {periodo}
                </Typography>
            </Grid>

            <Grid size={{ md: 2, xs: 1 }} sx={{ display: 'flex', justifyContent: 'start' }}>
                <IconButton onClick={handleNext} >
                    <ArrowForwardIcon sx={{ color: '#141259', fontSize: { md: 20, xs: 18 } }} />
                </IconButton>
            </Grid>

            <Grid size={{ md: 2, xs: 1 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                <Button onClick={liberaEditar}
                    sx={{
                        bgcolor: '#1b1464', color: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                        }
                    }} endIcon={<EditIcon />}
                >
                    Editar
                </Button>
            </Grid>
        </Grid>
    )
}

export default ButtonsPrevNext
