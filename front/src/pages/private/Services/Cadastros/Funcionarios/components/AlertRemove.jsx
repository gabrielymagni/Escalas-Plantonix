import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { sxButton } from "../../Blocos/components/AlertRemove";
import useFuncionarioHook from "../hooks/useFuncionarioHook";

const AlertRemove = ({ open, onClose, item, deleteFuncionario }) => {
    console.log("item", item);

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', fontSize: 18 }}>
                Remover o funcionário '{item.nome}'?
            </DialogTitle>

            <DialogActions>
                <Button onClick={() => onClose()} sx={sxButton}
                    endIcon={<CloseIcon />}>
                    Cancelar
                </Button>
                <Button onClick={() => deleteFuncionario(item.id)} autoFocus sx={sxButton}
                    endIcon={<DeleteOutlineIcon sx={{ color: '#ff4d4d' }} />} >
                    Remover
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlertRemove
