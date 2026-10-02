import { useEffect, useState, type PropsWithChildren } from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { prepararDatosIniciales } from '../../database/data/prepararDatosIniciales';

/** Prepara servicios locales antes de mostrar pantallas, con estado y reintento visibles. */
export function ProveedorDatos({ children }: PropsWithChildren) {
  const [listo, establecerListo] = useState(false);
  const [error, establecerError] = useState('');
  const [intento, establecerIntento] = useState(0);
  /** Inicializa datos sin actualizar un proveedor desmontado. */
  function preparar() {
    let vigente = true;
    /** Habilita las pantallas cuando los servicios están listos. */
    function completar() { if (vigente) establecerListo(true); }
    /** Comunica el error de persistencia para que el usuario pueda reintentar. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudieron preparar los datos.'); }
    void prepararDatosIniciales().then(completar, fallar);
    /** Ignora resultados posteriores al desmontaje. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(preparar, [intento]);
  /** Solicita un nuevo intento sin borrar datos existentes. */
  function reintentar() { establecerError(''); establecerIntento(intento + 1); }
  if (!listo) return <Stack spacing={2} sx={{ p: 3 }}>
    {error ? <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{error}</Alert> : <CircularProgress aria-label="Preparando datos locales" />}
  </Stack>;
  return children;
}
