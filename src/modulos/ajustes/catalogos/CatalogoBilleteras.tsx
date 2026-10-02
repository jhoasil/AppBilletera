import type { Billetera } from '../../../nucleo/entidades/Billetera';
import Alert from '@mui/material/Alert';
import { servicioBilleteras } from '../../../app/datos/serviciosCatalogos';
import { CampoTextoCatalogo } from '../../../compartido/componentes/CampoTextoCatalogo';
import { SelectorIcono } from '../../../compartido/componentes/SelectorIcono';
import { SelectorColor } from '../../../compartido/componentes/SelectorColor';
import { EditorCatalogo } from './EditorCatalogo';

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
  return <EditorCatalogo singular="billetera" servicio={servicioBilleteras} crearNuevo={crearBilletera} campos={campos} detalle={detalle} />;
}
