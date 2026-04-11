import { useEffect } from 'react';
import EstruturaTabela from '../../Funcionarios/components/EstruturaTabela'
import useModalRegras from '../hooks/useModalRegras';
import { getColumnsRegras, retornaRegras } from './ColunaRegras';
import { getRowsRegras } from './LinhasRegras';
import ModalEditar from './ModalEditar';
import AlertRemove from './AlertRemove';
import { Toaster } from 'sonner';
import { Backdrop, CircularProgress } from '@mui/material';

const TabelaRegras = () => {

  const { open, handleOpen, handleRemover, infoLinha, allRegras, getAllRegras,
    openRemover, deleteRegra, loading } = useModalRegras();

  useEffect(() => {
    getAllRegras()
  }, [])

  const rows = getRowsRegras(allRegras);
  const columns = getColumnsRegras(handleOpen, handleRemover);
  console.log('linha', infoLinha)

  return (
    <div>
      <EstruturaTabela rows={rows} columns={columns} />

      {open &&
        <ModalEditar open={open} handleOpen={handleOpen} info={infoLinha} />
      }

      {openRemover &&
        <AlertRemove open={openRemover} onClose={handleRemover}
          item={infoLinha} deleteRegra={deleteRegra} />
      }

      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Toaster />
    </div>
  )
}

export default TabelaRegras
