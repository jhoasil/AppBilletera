import { useEffect, useId, useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import type { Billetera } from '../../../nucleo/entidades/Billetera';
import { servicioSaldoInicial } from '../../../app/datos/servicioSaldoInicial';
import { CampoTextoCatalogo } from '../../../compartido/componentes/CampoTextoCatalogo';
import { fechaActual } from '../../../compartido/fechas/fechaActual';

/** Datos y cierre del diálogo para configurar una billetera existente. */
interface PropiedadesDialogoSaldoInicial {
  billetera: Billetera | null;
  alCerrar: () => void;
  alRegistrar: () => void;
}

/** Registra un saldo inicial una sola vez y comunica errores sin perder el importe ingresado. */
export function DialogoSaldoInicial({ billetera, alCerrar, alRegistrar }: PropiedadesDialogoSaldoInicial) {
  const [importe, establecerImporte] = useState('');
  const [fecha, establecerFecha] = useState(fechaActual);
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');
  const formularioId = useId();
  /** Limpia el formulario al elegir otra billetera. */
  function reiniciar() { establecerImporte(''); establecerFecha(fechaActual()); establecerError(''); }
  useEffect(reiniciar, [billetera?.id]);
  /** Evita cerrar durante la transacción de escritura. */
  function cerrar() { if (!pendiente) alCerrar(); }
  /** Confirma el movimiento y cierra solamente después de confirmar la transacción. */
  async function registrar(evento: FormEvent) {
    evento.preventDefault(); if (!billetera || pendiente) return;
    establecerPendiente(true); establecerError('');
    try { await servicioSaldoInicial.registrar(billetera.id, importe, fecha); alRegistrar(); }
    catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo registrar el saldo inicial.'); }
    finally { establecerPendiente(false); }
  }
  return <Dialog open={Boolean(billetera)} onClose={cerrar} fullWidth maxWidth="sm" aria-labelledby={`${formularioId}-titulo`}>
    <DialogTitle id={`${formularioId}-titulo`}>Saldo inicial · {billetera?.nombre}</DialogTitle>
    <DialogContent><Stack component="form" id={formularioId} onSubmit={registrar} spacing={2} sx={{ pt: 1 }}>
      <Alert severity="info">Se creará un movimiento de saldo inicial en {billetera?.moneda}. Solo se registra una vez; no representa un ajuste del saldo actual.</Alert>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <CampoTextoCatalogo etiqueta="Importe (ejemplo: 1500,25; sin miles)" valor={importe} alCambiar={establecerImporte} obligatorio />
        <CampoTextoCatalogo etiqueta="Fecha del saldo inicial" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio />
      </Stack>
    </Stack></DialogContent>
    <DialogActions><Button onClick={cerrar} disabled={pendiente}>Cancelar</Button><Button variant="contained" type="submit" form={formularioId} loading={pendiente}>Registrar saldo inicial</Button></DialogActions>
  </Dialog>;
}
