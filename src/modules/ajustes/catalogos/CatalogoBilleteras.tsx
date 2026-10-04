import { clasificarTipoBilletera, nombreTipoBilletera, tiposBilletera } from '../../../core/entities/TipoBilletera';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { SelectorCatalogo } from '../../../shared/components/SelectorCatalogo';
import { IconoCatalogo } from '../../../shared/components/IconoCatalogo';
import { servicioPatrimonio } from '../../../app/data/servicioPatrimonio';
import type { ResumenPatrimonio } from '../../../core/repositories/RepositorioPatrimonio';
import { formatearImporte } from '../../../shared/money/formatearImporte';
import { crearImporte } from '../../../core/money/Importe';
import { interpretarCampoRapido } from '../../../core/money/calcularCargaRapida';
import type { Billetera } from '../../../core/entities/Billetera';
import { useEffect, useState } from 'react';
import History from '@mui/icons-material/History';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { servicioBilleteras } from '../../../app/data/serviciosCatalogos';
import { guardarBilletera } from '../../../app/data/servicioSaldoInicial';
import { fechaActual } from '../../../shared/dates/fechaActual';
import { CampoTextoCatalogo } from '../../../shared/components/CampoTextoCatalogo';
import { SelectorIcono } from '../../../shared/components/SelectorIcono';
import { SelectorColor } from '../../../shared/components/SelectorColor';
import { EditorCatalogo } from './EditorCatalogo';
import { DialogoSaldoInicial } from './DialogoSaldoInicial';

/** Prepara una billetera sin saldo mutable y con la moneda inicial de la aplicación. */
function crearBilletera(): Billetera {
  return { id: '', nombre: '', tipo: 'efectivo', icono: 'account_balance_wallet', color: null, moneda: 'ARS', activo: true, conciliadoEn: null, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Resume la ubicación y moneda del dinero para consultar el catálogo. */
function detalle(billetera: Billetera) { return <Stack spacing={0.5}><Chip size="small" label={nombreTipoBilletera(billetera.tipo)} sx={{ alignSelf: "flex-start" }} /><Typography color="text.secondary">{billetera.moneda}</Typography></Stack>; }

/** Busca nombre, tipo y moneda exclusivamente en metadatos de catálogo. */
function textoBusqueda(billetera: Billetera) { return `${billetera.nombre} ${nombreTipoBilletera(billetera.tipo)} ${billetera.tipo} ${billetera.moneda}`; }

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
  return <><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}><SelectorCatalogo etiqueta="Tipo" etiquetaExterior valor={clasificarTipoBilletera(billetera.tipo) ?? ''} alCambiar={tipo} opciones={tiposBilletera} obligatorio />
    <SelectorCatalogo etiqueta="Moneda" etiquetaExterior valor={billetera.moneda} alCambiar={moneda} obligatorio opciones={[...new Set(['ARS', 'USD', billetera.moneda])].map(/** Conserva códigos existentes junto a las monedas habituales. */ function opcion(id) { return { id, nombre: id }; })} /></Box>
    <Typography variant="body2" color="text.secondary">Efectivo: billetes y monedas. Dinero digital: bancos, billeteras virtuales y cuentas digitales de cobro.</Typography>
    {!clasificarTipoBilletera(billetera.tipo) && <Alert severity="warning">El tipo anterior «{billetera.tipo || 'sin tipo'}» requiere clasificación. Elegí uno de los dos tipos antes de guardar.</Alert>}
    <details><summary>Otra moneda</summary><Stack spacing={1} sx={{ pt: 1 }}><CampoTextoCatalogo etiqueta="Código de moneda" valor={billetera.moneda} alCambiar={moneda} obligatorio /></Stack></details>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}><Box component="details" sx={{ minWidth: 0 }}><summary><IconoCatalogo identificador={billetera.icono} color={billetera.color} contenedor /> Icono</summary><SelectorIcono compacto valor={billetera.icono} alCambiar={icono} /></Box><Box component="details" sx={{ minWidth: 0 }}><summary><Box component="span" sx={{ display: 'inline-block', verticalAlign: 'middle', width: 32, height: 32, bgcolor: billetera.color ?? 'primary.main', borderRadius: '50%' }} /> Color</summary><SelectorColor compacto valor={billetera.color} alCambiar={color} /></Box></Box>
    {billetera.id && <Alert severity="info">El saldo proviene de movimientos. Para corregirlo usá Conciliar desde el detalle de la billetera.</Alert>}</>;

}

/** Administra billeteras exclusivamente desde Ajustes conservando sus referencias históricas. */
export function CatalogoBilleteras({ alVolver }: { alVolver?: () => void }) {
  const [patrimonio, establecerPatrimonio] = useState<ResumenPatrimonio | null>(null);
  const [errorSaldo, establecerErrorSaldo] = useState('');
  const [revision, establecerRevision] = useState(0);
  /** Consulta saldos agregados sin traer movimientos ni calcular dinero en la vista. */
  function cargarSaldos() {
    let vigente = true;
    void servicioPatrimonio.consultar(fechaActual(), fechaActual()).then(/** Publica la instantánea vigente. */ function completar(resultado) { if (vigente) { establecerPatrimonio(resultado); establecerErrorSaldo(''); } }, /** Expone errores de consulta sin mostrar ceros falsos. */ function fallar(causa) { if (vigente) establecerErrorSaldo(causa instanceof Error ? causa.message : 'No se pudieron consultar saldos.'); });
    return /** Descarta respuestas al abandonar la pantalla. */ function cancelar() { vigente = false; };
  }
  useEffect(cargarSaldos, [revision]);
  /** Formatea el saldo consultado de una billetera, sin reconstruirlo en React. */
  function saldo(billetera: Billetera) { const registro = patrimonio?.billeteras.find(/** Localiza la identidad persistida. */ function coincide(registro) { return registro.billetera.id === billetera.id; }); return <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{registro ? formatearImporte(crearImporte(registro.saldoCentavos, registro.billetera.moneda)) : '—'}</Typography>; }
  /** Filtra metadatos antes de paginar; el patrimonio siempre indica su alcance global. */
  function filtrar(billetera: Billetera, filtro: string) { return filtro === 'Todas' || (filtro === 'Efectivo' ? clasificarTipoBilletera(billetera.tipo) === 'efectivo' : filtro === 'Digital' ? clasificarTipoBilletera(billetera.tipo) === 'digital' : filtro === 'Activas' ? billetera.activo : billetera.moneda === filtro); }
  /** Previsualiza atributos e importe válido sin producir un movimiento. */
  function previsualizar(billetera: Billetera) {
    let importeVista = 'Importe pendiente';
    try { importeVista = formatearImporte(crearImporte(interpretarCampoRapido(importe), billetera.moneda)); } catch { /* El servicio valida al guardar; no se inventa un saldo para un texto inválido. */ }
    return <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}><IconoCatalogo identificador={billetera.icono} color={billetera.color} contenedor /><Box sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}><Typography sx={{ fontWeight: 700 }}>{billetera.nombre || 'Nombre de la billetera'}</Typography>{detalle(billetera)}</Box>{billetera.id ? saldo(billetera) : <Typography sx={{ fontWeight: 700 }}>{importeVista}</Typography>}</Stack>;
  }
  const resumen = <Stack spacing={1}>{errorSaldo && <Alert severity="error" action={<Button onClick={/** Reintenta la lectura agregada. */ function reintentar() { establecerRevision(revision + 1); }}>Reintentar</Button>}>{errorSaldo}</Alert>}{!errorSaldo && patrimonio?.totales.map(/** Mantiene monedas separadas sin conversión implícita. */ function mostrar(total) { return <Box key={total.moneda} sx={/** Resalta el patrimonio usando el verde de la paleta activa. */ function apariencia(tema) { return { p: 2, borderRadius: '16px', bgcolor: alpha(tema.palette.success.main, 0.09) }; }}><Typography>Total actual · {total.moneda} · todas las billeteras</Typography><Typography color="success.main" variant="h2">{formatearImporte(crearImporte(total.saldoCentavos, total.moneda))}</Typography><Button component="a" href="#/billeteras">Ver saldos y movimientos</Button></Box>; })}</Stack>;
  const [importe, establecerImporte] = useState('');
  const [fecha, establecerFecha] = useState(fechaActual);
  const [billeteraSaldo, establecerBilleteraSaldo] = useState<Billetera | null>(null);
  const [confirmacion, establecerConfirmacion] = useState('');
  /** Inicia una billetera con un saldo opcional independiente de sus atributos. */
  function crear() { establecerImporte(''); establecerFecha(fechaActual()); establecerConfirmacion(''); return crearBilletera(); }
  /** Añade importe y fecha solamente al crear; editar nunca modifica un saldo. */
  function camposConSaldo(billetera: Billetera, actualizar: (cambios: Partial<Billetera>) => void) {
    return <>{campos(billetera, actualizar)}{!billetera.id && <>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", "@media (min-width:390px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}><CampoTextoCatalogo etiquetaExterior etiqueta="Saldo inicial (sin miles)" valor={importe} alCambiar={establecerImporte} />
      <CampoTextoCatalogo etiquetaExterior etiqueta="Fecha del saldo inicial" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio={Boolean(importe.trim())} /></Box>
      <Alert severity="info">Si indicás un importe, se guardarán la billetera y su movimiento inicial juntos. Si lo dejás vacío, podés configurarlo más tarde.</Alert>
    </>}</>;
  }
  /** Guarda un saldo inicial opcional junto a la nueva billetera en una transacción. */
  async function guardar(billetera: Billetera) {
    await guardarBilletera(billetera, importe, fecha);
    establecerRevision(revision + 1);
    establecerConfirmacion(!billetera.id && importe.trim() ? 'Billetera y saldo inicial registrados.' : 'Billetera guardada.');
  }
  /** Abre la configuración inicial de una billetera activa existente. */
  function accion(billetera: Billetera, deshabilitado: boolean) {
    /** Elige el destino del movimiento de apertura. */
    function abrir() { establecerConfirmacion(''); establecerBilleteraSaldo(billetera); }
    return <details><summary>Más opciones</summary><Button startIcon={<History />} disabled={deshabilitado || !billetera.activo} onClick={abrir} aria-label={`Configurar saldo inicial de ${billetera.nombre}`}>Saldo inicial</Button></details>;
  }
  /** Cierra la configuración sin escribir cambios. */
  function cerrar() { establecerBilleteraSaldo(null); }
  /** Comunica una escritura confirmada sin simular un saldo mutable. */
  function registrado() { establecerRevision(revision + 1); establecerConfirmacion('Saldo inicial registrado como movimiento trazable.'); establecerBilleteraSaldo(null); }
  return <Stack spacing={2}>
    {confirmacion && <Alert severity="success">{confirmacion}</Alert>}
    <EditorCatalogo {...(alVolver ? { alVolver } : {})} titulo="Billeteras" filtros={["Todas", "Efectivo", "Digital", "Activas", ...new Set(["ARS", "USD", ...(patrimonio?.totales.map(/** Conserva monedas existentes en los filtros. */ function moneda(total) { return total.moneda; }) ?? [])])]} coincideFiltro={filtrar} resumen={resumen} valorDestacado={saldo} vistaPrevia={previsualizar} singular="billetera" etiquetaCrear="Nueva billetera" alturaTarjeta={88} tamanoIcono={48} textoBusqueda={textoBusqueda} servicio={servicioBilleteras} crearNuevo={crear} campos={camposConSaldo} detalle={detalle} guardarPersonalizado={guardar} accionAdicional={accion} />
    <DialogoSaldoInicial billetera={billeteraSaldo} alCerrar={cerrar} alRegistrar={registrado} />
  </Stack>;
}
