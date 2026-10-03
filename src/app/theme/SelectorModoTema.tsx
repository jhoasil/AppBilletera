import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircle from '@mui/icons-material/CheckCircle';
import SettingsBrightness from '@mui/icons-material/SettingsBrightness';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';
import { tokensVisuales } from './tokens';
import { temaClaro, temaOscuro } from './tema';
import { useTema } from './useTema';

const modos = [
  { valor: 'sistema', nombre: 'Sistema', descripcion: 'Sigue la apariencia del dispositivo', icono: SettingsBrightness },
  { valor: 'claro', nombre: 'Claro', descripcion: 'Fondos claros y texto oscuro', icono: LightMode },
  { valor: 'oscuro', nombre: 'Oscuro', descripcion: 'Fondos oscuros y texto claro', icono: DarkMode },
] as const;

/** Ofrece tres elecciones explícitas usando el proveedor de tema y la preferencia existentes. */
export function SelectorModoTema() {
  const { modo, cambiarModo } = useTema();
  return <Stack spacing={3} sx={{ maxWidth: 640, width: '100%' }}>
    <Typography color="text.secondary">La elección se aplica a toda la aplicación y se recuerda en este dispositivo. Sistema sigue los cambios de apariencia del dispositivo.</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
      {modos.map(/** Conserva selección textual, icono y borde para que no dependa solo del color. */ function mostrar(opcion) {
        const Icono = opcion.icono; const seleccionada = modo === opcion.valor;
        /** Cambia únicamente la preferencia de apariencia ya soportada. */
        function elegir() { cambiarModo(opcion.valor); }
        return <Button key={opcion.valor} onClick={elegir} aria-pressed={seleccionada} sx={{ minHeight: 112, border: '2px solid', borderColor: seleccionada ? 'primary.main' : 'divider', borderRadius: `${tokensVisuales.radioTarjeta}px`, bgcolor: seleccionada ? 'action.selected' : 'background.paper' }}><Stack spacing={1} sx={{ alignItems: 'center' }}><Icono /><Typography sx={{ fontWeight: 600 }}>{opcion.nombre}{seleccionada && <CheckCircle aria-hidden="true" sx={{ ml: 1, fontSize: 18, verticalAlign: 'middle' }} />}</Typography><Typography variant="body2" color="text.secondary">{opcion.descripcion}</Typography></Stack></Button>;
      })}
    </Box>
    <Typography variant="h6">Vista previa</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
      {[{ nombre: 'Claro', tema: temaClaro }, { nombre: 'Oscuro', tema: temaOscuro }].map(/** Ilustra ambos temas con sus tokens centrales sin montar otro proveedor. */ function mostrarVista({ nombre, tema }) {
        return <Box key={nombre} sx={{ p: 2, bgcolor: tema.palette.background.default, color: tema.palette.text.primary, borderRadius: `${tokensVisuales.radioInput}px`, border: '1px solid', borderColor: tema.palette.divider }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>{nombre}</Typography><Box sx={{ p: 2, bgcolor: tema.palette.background.paper, borderRadius: `${tokensVisuales.radioTarjeta}px` }}><Typography variant="body2">AppBilletera</Typography><Typography variant="body2" sx={{ color: tema.palette.text.secondary, my: 1 }}>Tarjetas y formularios</Typography><Box sx={{ p: 1, textAlign: 'center', borderRadius: `${tokensVisuales.radioInput}px`, bgcolor: tema.palette.primary.main, color: tema.palette.primary.contrastText }}>Acción principal</Box></Box>
        </Box>;
      })}
    </Box>
  </Stack>;
}
