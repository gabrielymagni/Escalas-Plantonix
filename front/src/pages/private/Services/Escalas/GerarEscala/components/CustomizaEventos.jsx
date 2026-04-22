import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";

const CustomizaEventos = ({ item, getItemProps, onChangeItem }) => {

    const background = (texto) => {
        if (texto === 'Manhã e Tarde') return '#5c8526';
        if (texto === 'Manhã') return '#7e8526';
        if (texto === 'Tarde') return '#d6660a';
        if (texto === 'Noite') return '#141259';
        if (texto === 'Folga') return '#797979';
    }

    const retornaLabel = (texto) => {
        if (texto === 'Manhã e Tarde') return 'MT';
        if (texto === 'Manhã') return 'M';
        if (texto === 'Tarde') return 'T';
        if (texto === 'Noite') return 'N';
        if (texto === 'Folga') return 'F';
    }

    const handleChange = (event) => {
        onChangeItem(item.id, event.target.value);
    };

    return (
        <div
            {...getItemProps({
                style: {
                    background: background(item.title),
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }
            })}
        >
            <Select size="small"
                value={item.title}
                onChange={handleChange}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                variant="standard"
                disableUnderline
                sx={sxItem}
            >
                {OpcoesEventos.map(item => (
                    <MenuItem value={item.turno} >{item.id}</MenuItem>
                ))}
            </Select>
            {/* <Autocomplete size="small"
                options={OpcoesEventos}
                defaultValue={OpcoesEventos.find(op => op.turno === item.title) || null}
                getOptionLabel={(option) => option.tipo}
                renderInput={(params) => (
                    <TextField {...params} label="Tipo profissional" required name="tipo_profissional" />
                )}
            /> */}
        </div>
    );
};

export default CustomizaEventos

export const OpcoesEventos = [
    { id: 'M', turno: 'Manhã' },
    { id: 'T', turno: 'Tarde' },
    { id: 'MT', turno: 'Manhã e Tarde' },
    { id: 'N', turno: 'Noite' },
    { id: 'F', turno: 'Folga' },
];

export const sxItem = () => ({
    width: "100%",
    height: "100%",
    color: "#fff",
    "&::before": { borderBottom: "none" },
    "&::after": { borderBottom: "none" },
    "&:hover:not(.Mui-disabled)::before": {
        borderBottom: "none"
    },
    ".MuiSelect-select": {
        padding: "0px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
})