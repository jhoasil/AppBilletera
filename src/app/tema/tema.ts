import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { colores } from './colores';
import { tipografia } from './tipografia';
import { componentes } from './componentes';

/** Tema base que reúne los estilos y la traducción española de Material UI. */
export const tema = createTheme(
  {
    palette: colores,
    typography: tipografia,
    shape: { borderRadius: 12 },
    components: componentes,
  },
  esES,
);
