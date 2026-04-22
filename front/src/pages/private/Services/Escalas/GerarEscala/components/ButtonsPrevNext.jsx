import { Grid, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ButtonsPrevNext = ({ periodo, handleNext, handlePrev }) => {
    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid size={{ md: 3, xs: 1 }} sx={{display: 'flex', justifyContent: 'end'}}>
                <IconButton onClick={handlePrev} >
                    <ArrowBackIcon sx={{ color: '#141259', fontSize: { md: 20, xs: 18 } }} />
                </IconButton>
            </Grid>

            <Grid size={{ md: 6, xs: 10 }} >
                <Typography sx={{ color: '#141259', fontWeight: 'bold', fontSize: { md: 20, xs: 14 }, textAlign: 'center' }}>
                    {periodo}
                </Typography>
            </Grid>

            <Grid size={{ md: 3, xs: 1 }} sx={{display: 'flex', justifyContent: 'start'}}>
                <IconButton onClick={handleNext} >
                    <ArrowForwardIcon sx={{ color: '#141259', fontSize: { md: 20, xs: 18 } }} />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default ButtonsPrevNext
