import { useState, type ChangeEvent } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { servicioRespaldo } from '../../app/data/servicioRespaldo';
import { exportarArchivoRespaldo } from '../../app/data/exportarArchivoRespaldo';

/** Permite descargar un respaldo y confirmar la incorporación transaccional de un archivo elegido. */
export function RespaldoDatos() {
  const [texto, establecerTexto] = useState(''); const [nombre, establecerNombre] = useState(''); const [pendiente, establecerPendiente] = useState(false); const [error, establecerError] = useState(''); const [mensaje, establecerMensaje] = useState('');
  /** Descarga JSON por solicitud explícita y libera su URL temporal. */
  async function exportar() { establecerPendiente(true); establecerError(''); try { await exportarArchivoRespaldo(await servicioRespaldo.exportar()); } catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo exportar.'); } finally { establecerPendiente(false); } }
  /** Lee un archivo seleccionado sin escribir todavía en la base. */
  async function elegir(evento: ChangeEvent<HTMLInputElement>) { const archivo = evento.target.files?.[0]; establecerTexto(''); establecerMensaje(''); establecerError(''); if (!archivo) return; if (archivo.size > 50 * 1024 * 1024) { establecerError('El respaldo supera el límite de 50 MB.'); return; } try { establecerNombre(archivo.name); establecerTexto(await archivo.text()); } catch { establecerError('No se pudo leer el archivo.'); } }
  /** Confirma la importación elegida; los conflictos no sobrescriben registros existentes. */
  async function importar() { if (pendiente || !texto) return; establecerPendiente(true); establecerError(''); try { await servicioRespaldo.importar(texto); establecerTexto(''); establecerMensaje('Respaldo importado. Los registros existentes se conservaron.'); } catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo importar.'); } finally { establecerPendiente(false); } }
  return <Stack spacing={2}><Typography>El respaldo incluye datos financieros e historia. Guardalo en un lugar privado. La importación incorpora registros faltantes, conserva los idénticos y rechaza diferencias sobre la misma identidad.</Typography>{error && <Alert severity="error">{error}</Alert>}{mensaje && <Alert severity="success">{mensaje}</Alert>}<Button onClick={exportar} variant="contained" disabled={pendiente}>Exportar respaldo</Button><Button component="label" variant="outlined" disabled={pendiente}>Elegir respaldo<input type="file" accept="application/json,.json" hidden onChange={elegir} disabled={pendiente} /></Button>{texto && <><Typography>Archivo: {nombre}</Typography><Button onClick={importar} variant="contained" loading={pendiente}>Confirmar importación</Button></>}</Stack>;
}
