import { Autocomplete, Button, Grid, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import useModalBlocoHook from "../../../Cadastros/Blocos/hooks/useModalBlocoHook";
import { useEffect } from "react";

const FiltraBlocos = ({ filtraBloco, handleOpen }) => {
    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    useEffect(() => {
        getAllBlocos();
    }, [])

    return (
        <form onSubmit={(e) => filtraBloco(e, allBlocos)}>
            <Grid container spacing={2} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2
            }}>
                <Grid size={{ md: 4, xs: 8 }} >
                    <Autocomplete
                        options={allBlocos}
                        getOptionLabel={(option) => option.nome}
                        renderInput={(params) => (
                            <TextField {...params} label="Filtre pelo bloco" required name="bloco" />
                        )}
                    />
                </Grid>

                <Grid size={{ md: 2, xs: 4 }} sx={{ display: 'flex', justifyContent: 'start' }} >
                    <Button type="submit"
                        sx={{
                            bgcolor: '#1b1464', color: '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                            }
                        }} endIcon={<SearchIcon />}>
                        Filtrar
                    </Button>
                </Grid>

                <Grid size={{ md: 6, xs: 12 }} gap={2} sx={{ display: 'flex', justifyContent: 'end' }} >
                    <Button onClick={handleOpen}
                        sx={{
                            bgcolor: '#1b1464', color: '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                            }
                        }} endIcon={<AddIcon />}>
                        Adicionar
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default FiltraBlocos
