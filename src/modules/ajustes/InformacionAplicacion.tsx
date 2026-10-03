import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { informacionAplicacion } from '../../app/informacionAplicacion';

/** Muestra identidad, versión y build desde la fuente central sin duplicar valores en pantallas. */
export function InformacionAplicacion() { return <Stack spacing={1}><Typography variant="h5">{informacionAplicacion.nombre}</Typography><Typography>Versión: {informacionAplicacion.version}</Typography><Typography>Build: {informacionAplicacion.compilacion}</Typography><Typography color="text.secondary">Tus datos financieros permanecen en este dispositivo.</Typography></Stack>; }
