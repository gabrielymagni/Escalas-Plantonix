import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"
import useModalBlocoHook from "../hooks/useModalBlocoHook";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

const AlertRemove = ({ open, onClose, item, deleteBloco }) => {
    console.log("item", item)

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', fontSize: 18 }}>
                Remover o bloco '{item.nome}'?
            </DialogTitle>

            <DialogActions>
                <Button onClick={() => onClose()} sx={sxButton}
                    endIcon={<CloseIcon />}>
                    Cancelar
                </Button>
                <Button onClick={() => deleteBloco(item.id)} autoFocus sx={sxButton}
                    endIcon={<DeleteOutlineIcon sx={{ color: '#ff4d4d' }} />} >
                    Remover
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlertRemove

export const sxButton = () => ({
    color: '#141259',
    border: '2px solid #141259',
    fontWeight: 'bold',
    textTransform: "none",
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0px 6px 15px rgba(0,0,0,0.2)',
    }
})