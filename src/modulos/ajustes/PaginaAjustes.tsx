import Stack from '@mui/material/Stack';
import { SelectorModoTema } from '../../app/tema/SelectorModoTema';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';

/** Presenta Ajustes y conserva el control de apariencia hasta incorporar los catálogos. */
export function PaginaAjustes() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <CabeceraPagina titulo="Ajustes" descripcion="La configuración de catálogos y datos se incorporará en próximas tareas." />
      <SelectorModoTema />
    </Stack>
  );
}
