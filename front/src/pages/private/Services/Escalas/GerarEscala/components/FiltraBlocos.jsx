import { Autocomplete, Button, Grid, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import useModalBlocoHook from "../../../Cadastros/Blocos/hooks/useModalBlocoHook";
import { useEffect } from "react";

const FiltraBlocos = ({ filtraBloco, handleOpen, selectedBloco, onBlocoChange, onBlocosLoaded, handlePrint }) => {
    const { allBlocos, getAllBlocos } = useModalBlocoHook();

    useEffect(() => {
        getAllBlocos();
    }, [])

    useEffect(() => {
        if (allBlocos.length > 0) onBlocosLoaded?.(allBlocos);
    }, [allBlocos])

    return (
        <form onSubmit={(e) => filtraBloco(e, allBlocos)}>
            <Grid container spacing={2} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2
            }}>
                <Grid size={{ md: 4, xs: 8 }} >
                    <Autocomplete
                        options={allBlocos}
                        getOptionLabel={(option) => option.nome}
                        value={selectedBloco}
                        onChange={(_, newValue) => onBlocoChange?.(newValue)}
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
                            '&:hover': { transform: 'translateY(-3px)' }
                        }} endIcon={<SearchIcon />}>
                        Filtrar
                    </Button>
                </Grid>

                <Grid size={{ md: 6, xs: 12 }} gap={2} sx={{ display: 'flex', justifyContent: 'end' }} >
                    {allBlocos.length > 0 &&
                        <Button onClick={handlePrint}
                            sx={{
                                bgcolor: '#50b5ae', color: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }} endIcon={<PrintIcon />}>
                            Imprimir
                        </Button>
                    }
                    <Button onClick={handleOpen}
                        sx={{
                            bgcolor: '#1b1464', color: '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-3px)' }
                        }} endIcon={<AddIcon />}>
                        Adicionar
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default FiltraBlocos
