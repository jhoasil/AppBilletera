import type { Billetera } from '../../../nucleo/entidades/Billetera';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { servicioBilleteras } from '../../../app/datos/serviciosCatalogos';
import { guardarBilletera } from '../../../app/datos/servicioSaldoInicial';
import { fechaActual } from '../../../compartido/fechas/fechaActual';
import { CampoTextoCatalogo } from '../../../compartido/componentes/CampoTextoCatalogo';
import { SelectorIcono } from '../../../compartido/componentes/SelectorIcono';
import { SelectorColor } from '../../../compartido/componentes/SelectorColor';
import { EditorCatalogo } from './EditorCatalogo';
import { DialogoSaldoInicial } from './DialogoSaldoInicial';

/** Prepara una billetera sin saldo mutable y con la moneda inicial de la aplicación. */
function crearBilletera(): Billetera {
  return { id: '', nombre: '', tipo: 'efectivo', icono: 'account_balance_wallet', color: null, moneda: 'ARS', activo: true, conciliadoEn: null, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Resume la ubicación y moneda del dinero para consultar el catálogo. */
function detalle(billetera: Billetera) { return `${billetera.tipo} · ${billetera.moneda} · ${billetera.activo ? 'Activa' : 'Inactiva'}`; }

/** Edita únicamente propiedades de billetera; los saldos provienen de movimientos. */
function campos(billetera: Billetera, actualizar: (cambios: Partial<Billetera>) => void) {
  /** Actualiza la clasificación libre de la billetera. */
  function tipo(valor: string) { actualizar({ tipo: valor }); }
  /** Normaliza el código de moneda antes de validarlo. */
  function moneda(valor: string) { actualizar({ moneda: valor.trim().toUpperCase() }); }
  /** Conserva solamente el identificador del icono. */
  function icono(valor: string) { actualizar({ icono: valor }); }
  /** Cambia el metadato de color opcional. */
  function color(valor: string) { actualizar({ color: valor || null }); }
  return <><CampoTextoCatalogo etiqueta="Tipo" valor={billetera.tipo} alCambiar={tipo} obligatorio />
    <CampoTextoCatalogo etiqueta="Moneda (código de tres letras)" valor={billetera.moneda} alCambiar={moneda} obligatorio />
    <SelectorIcono valor={billetera.icono} alCambiar={icono} /><SelectorColor valor={billetera.color} alCambiar={color} />
    <Alert severity="info">El saldo se reconstruye a partir de los movimientos y no se edita desde este catálogo.</Alert></>;
}

/** Administra billeteras exclusivamente desde Ajustes conservando sus referencias históricas. */
export function CatalogoBilleteras() {
  const [importe, establecerImporte] = useState('');
  const [fecha, establecerFecha] = useState(fechaActual);
  const [billeteraSaldo, establecerBilleteraSaldo] = useState<Billetera | null>(null);
  const [confirmacion, establecerConfirmacion] = useState('');
  /** Inicia una billetera con un saldo opcional independiente de sus atributos. */
  function crear() { establecerImporte(''); establecerFecha(fechaActual()); establecerConfirmacion(''); return crearBilletera(); }
  /** Añade importe y fecha solamente al crear; editar nunca modifica un saldo. */
  function camposConSaldo(billetera: Billetera, actualizar: (cambios: Partial<Billetera>) => void) {
    return <>{campos(billetera, actualizar)}{!billetera.id && <>
      <CampoTextoCatalogo etiqueta="Saldo inicial opcional (ejemplo: 1500,25; sin miles)" valor={importe} alCambiar={establecerImporte} />
      <CampoTextoCatalogo etiqueta="Fecha del saldo inicial" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio={Boolean(importe.trim())} />
      <Alert severity="info">Si indicás un importe, se guardarán la billetera y su movimiento inicial juntos. Si lo dejás vacío, podés configurarlo más tarde.</Alert>
    </>}</>;
  }
  /** Guarda un saldo inicial opcional junto a la nueva billetera en una transacción. */
  async function guardar(billetera: Billetera) {
    await guardarBilletera(billetera, importe, fecha);
    establecerConfirmacion(!billetera.id && importe.trim() ? 'Billetera y saldo inicial registrados.' : 'Billetera guardada.');
  }
  /** Abre la configuración inicial de una billetera activa existente. */
  function accion(billetera: Billetera, deshabilitado: boolean) {
    /** Elige el destino del movimiento de apertura. */
    function abrir() { establecerConfirmacion(''); establecerBilleteraSaldo(billetera); }
    return <Button disabled={deshabilitado || !billetera.activo} onClick={abrir} aria-label={`Configurar saldo inicial de ${billetera.nombre}`}>Saldo inicial</Button>;
  }
  /** Cierra la configuración sin escribir cambios. */
  function cerrar() { establecerBilleteraSaldo(null); }
  /** Comunica una escritura confirmada sin simular un saldo mutable. */
  function registrado() { establecerConfirmacion('Saldo inicial registrado como movimiento trazable.'); establecerBilleteraSaldo(null); }
  return <Stack spacing={2}>
    <Button component="a" href="#/transferencias" variant="outlined">Transferir entre billeteras</Button>
    {confirmacion && <Alert severity="success">{confirmacion}</Alert>}
    <EditorCatalogo singular="billetera" servicio={servicioBilleteras} crearNuevo={crear} campos={camposConSaldo} detalle={detalle} guardarPersonalizado={guardar} accionAdicional={accion} />
    <DialogoSaldoInicial billetera={billeteraSaldo} alCerrar={cerrar} alRegistrar={registrado} />
  </Stack>;
}
