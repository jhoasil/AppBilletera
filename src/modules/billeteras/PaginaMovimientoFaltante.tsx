import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useParametroRuta } from '../../app/navigation/useParametroRuta';
import { servicioDetalleBilletera } from '../../app/data/servicioDetalleBilletera';
import { servicioIngresos } from '../../app/data/servicioIngresos';
import { servicioGastos } from '../../app/data/servicioGastos';
import { cargarDatosIngreso } from '../../app/data/datosCargaRapida';
import { preferenciasUI } from '../../app/preferences/ServicioPreferenciasUI';
import { tokensVisuales } from '../../app/theme/tokens';
import { calcularConciliacion } from '../../core/services/calcularConciliacion';
import { calcularImpactoMovimientoFaltante } from '../../core/services/calcularImpactoMovimientoFaltante';
import type { CargaIngreso, LineaCobro } from '../../core/services/CargaIngreso';
import type { CargaGasto } from '../../core/services/CargaGasto';
import type { DetalleBilletera } from '../../core/repositories/RepositorioDetalleBilletera';
import { crearImporte } from '../../core/money/Importe';
import { FormularioIngreso } from '../ingresos/FormularioIngreso';
import { FormularioGasto } from '../gastos/FormularioGasto';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { fechaActual } from '../../shared/dates/fechaActual';
import { formatearImporte } from '../../shared/money/formatearImporte';

/** Reutiliza el flujo normal de ingreso o gasto, conservando el contexto de la billetera conciliada. */
export function PaginaMovimientoFaltante() {
  const id = useParametroRuta('id'); const real = useParametroRuta('real');
  const [datos, establecerDatos] = useState<DetalleBilletera | null>(null);
  const [inicial, establecerInicial] = useState<(CargaIngreso & { categoriaId: string }) | null>(null);
  const [guardando, establecerGuardando] = useState(false);
  const [diferencia, establecerDiferencia] = useState(0);
  const [tipo, establecerTipo] = useState<'ingreso' | 'gasto'>('gasto');
  const [error, establecerError] = useState(''); const [revision, establecerRevision] = useState(0);
  /** Recupera saldo y catálogos para sugerir una operación real, sin escribir ningún ajuste. */
  function cargar() {
    let vigente = true; establecerDatos(null); establecerInicial(null); establecerError('');
    /** Prepara datos de formulario con UUID de catálogos disponibles y la billetera real explícita. */
    function recibir([detalle, catalogos]: [DetalleBilletera, Awaited<ReturnType<typeof cargarDatosIngreso>>]) {
      if (!vigente) return;
      if (!detalle.billetera.activo) throw new Error('La billetera debe estar activa para registrar el movimiento faltante.');
      const comparacion = calcularConciliacion(detalle.saldoCentavos, real, detalle.billetera.moneda);
      const tipoInicial = comparacion.diferenciaCentavos < 0 ? 'gasto' : 'ingreso';
      const medio = catalogos.medios.find(/** Prefiere una sugerencia compatible exclusivamente para esta operación nueva. */ function sugerido(registro) { return registro.activo && registro.billeteraPredeterminadaId === id; })
        ?? catalogos.medios.find(/** Ofrece una alternativa activa que el usuario podrá cambiar. */ function activo(registro) { return registro.activo; });
      if (!medio && comparacion.diferenciaCentavos !== 0) throw new Error('Configurá un medio de pago activo en Ajustes antes de registrar el movimiento.');
      const centavos = BigInt(Math.abs(comparacion.diferenciaCentavos));
      /** Incluye únicamente identidades disponibles para nuevas operaciones. */
      function activo(registro: { activo: boolean }) { return registro.activo; }
      establecerDatos(detalle); establecerTipo(tipoInicial); establecerDiferencia(comparacion.diferenciaCentavos);
      establecerInicial({ actividadId: preferenciasUI.obtenerDisponible(tipoInicial === 'ingreso' ? 'ultima_actividad_ingreso' : 'ultima_actividad_gasto', catalogos.actividades.filter(activo)), categoriaId: preferenciasUI.obtenerDisponible('ultima_categoria_gasto', catalogos.categorias.filter(activo)), fecha: fechaActual(), descripcion: '', observaciones: '', moneda: detalle.billetera.moneda, lineas: medio ? [{ medioPagoId: medio.id, billeteraId: id, importeCentavos: Number(centavos) }] : [] });
    }
    /** Conserva el error para permitir reintentar sin persistir operaciones incompletas. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo preparar el movimiento faltante.'); }
    void Promise.all([servicioDetalleBilletera.consultar(id), cargarDatosIngreso()]).then(recibir).catch(fallar);
    /** Cancela publicaciones de una consulta abandonada. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [id, real, revision]);
  /** Reintenta recuperar el contexto actual de la conciliación. */
  function reintentar() { establecerRevision(revision + 1); }
  /** Permite elegir la operación real que el usuario reconoce como faltante. */
  function elegirTipo(_evento: unknown, valor: 'ingreso' | 'gasto' | null) { if (valor) establecerTipo(valor); }
  /** Formatea un importe usando exclusivamente la moneda de la billetera conciliada. */
  function importe(centavos: number) { return formatearImporte(crearImporte(centavos, datos!.billetera.moneda)); }
  /** Exige impacto en la billetera del contexto; el servicio habitual conserva las demás validaciones. */
  function validarDestino(moneda: string, lineas: readonly LineaCobro[]) {
    const impacto = calcularImpactoMovimientoFaltante(datos!.saldoCentavos, datos!.billetera, moneda, lineas, tipo);
    if (impacto.movimientoCentavos === 0) throw new Error('Asigná un importe positivo a la billetera que estás conciliando.');
  }
  /** Persiste un ingreso real mediante la misma transacción utilizada por el formulario habitual. */
  async function guardarIngreso(carga: CargaIngreso) { validarDestino(carga.moneda, carga.lineas); establecerGuardando(true); try { await servicioIngresos.crear(carga); } finally { establecerGuardando(false); } }
  /** Persiste un gasto real sin crear simultáneamente un ajuste de conciliación. */
  async function guardarGasto(carga: CargaGasto) { validarDestino(carga.moneda, carga.lineas); establecerGuardando(true); try { await servicioGastos.crear(carga); } finally { establecerGuardando(false); } }
  /** Vuelve a comparar con el saldo real declarado después de confirmar la operación normal. */
  function completado() { window.location.hash = `#/conciliacion?id=${encodeURIComponent(id)}&real=${encodeURIComponent(real)}`; }
  /** Presenta el impacto delegado al dominio y recalcula al editar medios, billeteras o importes. */
  function mostrarImpacto(moneda: string, lineas: readonly LineaCobro[]) {
    try {
      const impacto = calcularImpactoMovimientoFaltante(datos!.saldoCentavos, datos!.billetera, moneda, lineas, tipo);
      return <Paper variant="outlined" aria-live="polite" sx={{ p: 2, bgcolor: 'action.hover' }}><Stack spacing={1}><Typography variant="h6">Impacto en {datos!.billetera.nombre}</Typography><Typography>Saldo calculado: {importe(datos!.saldoCentavos)}</Typography><Typography>Movimiento: {impacto.movimientoCentavos > 0 ? '+' : ''}{importe(impacto.movimientoCentavos)}</Typography><Typography sx={{ fontSize: 24, fontWeight: 700, overflowWrap: 'anywhere' }}>Nuevo saldo esperado: {importe(impacto.saldoEsperadoCentavos)}</Typography></Stack></Paper>;
    } catch (causa) { return <Alert severity="error">{causa instanceof Error ? causa.message : 'No se pudo calcular el impacto.'}</Alert>; }
  }
  return <Stack spacing={2} sx={{ maxWidth: tokensVisuales.anchoFormulario, width: '100%' }}>
    <CabeceraPagina titulo="Registrar movimiento faltante" regreso={{ href: `#/conciliacion?id=${encodeURIComponent(id)}&real=${encodeURIComponent(real)}`, etiqueta: "Volver a conciliación", deshabilitado: guardando }} />
    {error && <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{error}</Alert>}
    {!datos || !inicial ? !error && <CircularProgress aria-label="Preparando movimiento faltante" /> : diferencia === 0 ? <Alert severity="success">Los saldos ya coinciden. Volvé a conciliación; no hace falta registrar otra operación.</Alert> : <>
      <Alert severity="info" sx={{ p: 1.5 }}>La billetera {datos.billetera.nombre} presenta una diferencia de {importe(diferencia)}. Podés registrar la operación real omitida para corregir el saldo. Este flujo no genera un ajuste adicional.</Alert>
      <ToggleButtonGroup disabled={guardando} exclusive value={tipo} onChange={elegirTipo} aria-label="Tipo de movimiento faltante" sx={{ flexWrap: 'wrap' }}><ToggleButton value="gasto">Registrar gasto</ToggleButton><ToggleButton value="ingreso">Registrar ingreso</ToggleButton></ToggleButtonGroup>
      {tipo === 'ingreso' ? <FormularioIngreso inicial={inicial} alGuardar={guardarIngreso} alCompletar={completado} resumenImpacto={mostrarImpacto} /> : <FormularioGasto inicial={inicial} alGuardar={guardarGasto} alCompletar={completado} resumenImpacto={mostrarImpacto} />}
    </>}
  </Stack>;
}
