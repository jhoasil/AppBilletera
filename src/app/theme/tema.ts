import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { coloresClaros, coloresOscuros } from './colores';
import { tipografia } from './tipografia';
import { tokensVisuales } from './tokens';
import { componentes } from './componentes';

/** Crea un tema con la paleta elegida y mantiene los estilos compartidos de la aplicación. */
function crearTema(oscuro: boolean) {
  return createTheme(
    {
      palette: oscuro ? coloresOscuros : coloresClaros,
      typography: tipografia,
      spacing: tokensVisuales.espaciado,
      breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
      shape: { borderRadius: 12 },
      components: componentes,
    },
    esES,
  );
}

export const temaClaro = crearTema(false);
export const temaOscuro = crearTema(true);
