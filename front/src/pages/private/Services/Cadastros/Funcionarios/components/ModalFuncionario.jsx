import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

const ModalFuncionario = ({ open, info, handleCloseModal }) => {

    return (
        <div>
            <Dialog
                fullWidth={'md'}
                open={open}
            onClose={handleCloseModal}
            >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#141259", position: "relative" }}>
                    Detalhes

                    <IconButton aria-label="close" 
                    onClick={handleCloseModal} 
                    sx={{ position: "absolute", right: 8, top: 8 }} >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    teste
                </DialogContent>
                <DialogActions>
                    <Button
                    onClick={handleCloseModal}
                    >Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ModalFuncionario
