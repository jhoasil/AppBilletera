import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Home from '@mui/icons-material/Home';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import BarChart from '@mui/icons-material/BarChart';
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
  return <Stack spacing={2} sx={{ maxWidth: 600, width: '100%' }}>
    <Typography color="text.secondary">La elección se aplica a toda la aplicación y se recuerda en este dispositivo. Sistema sigue los cambios de apariencia del dispositivo.</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', '@media (min-width:360px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }, gap: 1 }}>
      {modos.map(/** Conserva selección textual, icono y borde para que no dependa solo del color. */ function mostrar(opcion) {
        const Icono = opcion.icono; const seleccionada = modo === opcion.valor;
        /** Cambia únicamente la preferencia de apariencia ya soportada. */
        function elegir() { cambiarModo(opcion.valor); }
        return <Button key={opcion.valor} onClick={elegir} aria-pressed={seleccionada} title={opcion.descripcion} sx={{ minHeight: 96, border: '2px solid', borderColor: seleccionada ? 'primary.main' : 'divider', borderRadius: `${tokensVisuales.radioTarjeta}px`, bgcolor: seleccionada ? 'action.selected' : 'background.paper' }}><Stack spacing={1} sx={{ alignItems: 'center' }}><Icono /><Typography sx={{ fontWeight: 600 }}>{opcion.nombre}{seleccionada && <CheckCircle aria-hidden="true" sx={{ ml: 1, fontSize: 18, verticalAlign: 'middle' }} />}</Typography></Stack></Button>;
      })}
    </Box>
    <Typography variant="h6">Vista previa</Typography><Typography variant="body2" color="text.secondary">Miniaturas de ejemplo; no muestran tus datos.</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', '@media (min-width:390px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
      {[{ nombre: 'Claro', tema: temaClaro }, { nombre: 'Oscuro', tema: temaOscuro }].map(/** Ilustra ambos temas con sus tokens centrales sin montar otro proveedor. */ function mostrarVista({ nombre, tema }) {
        return <Box key={nombre} sx={{ p: 2, bgcolor: tema.palette.background.default, color: tema.palette.text.primary, borderRadius: `${tokensVisuales.radioInput}px`, border: '1px solid', borderColor: tema.palette.divider }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>{nombre}</Typography>
          {/* Esta miniatura usa tokens de cada paleta y contenido ilustrativo, sin proveedores anidados. */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}><AccountBalanceWallet sx={{ color: tema.palette.primary.main, fontSize: 18 }} /><Typography sx={{ fontSize: 12, fontWeight: 600 }}>AppBilletera</Typography></Stack>
            <Box sx={{ p: 1, bgcolor: tema.palette.background.paper, borderRadius: '12px', border: '1px solid', borderColor: tema.palette.divider }}><Typography sx={{ fontSize: 12 }}>Ganancia de hoy</Typography><Typography sx={{ fontSize: 24, fontWeight: 700 }}>$90.000</Typography></Box>
            <Box sx={{ p: 1, fontSize: 12, textAlign: 'center', borderRadius: '12px', bgcolor: tema.palette.success.main, color: tema.palette.success.contrastText }}>+ Agregar ingreso</Box>
            <Stack direction="row" sx={{ justifyContent: 'space-around', color: tema.palette.text.secondary, pt: 1 }}>{[{ nombre: 'Inicio', Icono: Home }, { nombre: 'Ingresos', Icono: ArrowDownward }, { nombre: 'Gastos', Icono: ArrowUpward }, { nombre: 'Reportes', Icono: BarChart }].map(function destino(opcion) { return <Stack key={opcion.nombre} sx={{ alignItems: 'center', color: opcion.nombre === 'Inicio' ? tema.palette.primary.main : 'inherit' }}><opcion.Icono sx={{ fontSize: 16 }} /><Typography sx={{ fontSize: 9 }}>{opcion.nombre}</Typography></Stack>; })}</Stack>
          </Stack>
        </Box>;
      })}
    </Box>
  </Stack>;
}
