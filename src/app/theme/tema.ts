import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { coloresClaros, coloresOscuros } from './colores';
import { tipografia } from './tipografia';
import { componentes } from './componentes';

/** Crea un tema con la paleta elegida y mantiene los estilos compartidos de la aplicación. */
function crearTema(oscuro: boolean) {
  return createTheme(
    {
      palette: oscuro ? coloresOscuros : coloresClaros,
      typography: tipografia,
      shape: { borderRadius: 12 },
      components: componentes,
    },
    esES,
  );
}

export const temaClaro = crearTema(false);
export const temaOscuro = crearTema(true);
