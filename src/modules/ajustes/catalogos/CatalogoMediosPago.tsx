import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { SelectorIcono } from '../../../shared/components/SelectorIcono';
import { SelectorColor } from '../../../shared/components/SelectorColor';
import { listarCatalogo } from '../../../app/data/datosCargaRapida';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import type { MedioPago } from '../../../core/entities/MedioPago';
import type { Billetera } from '../../../core/entities/Billetera';
import { servicioBilleteras, servicioMedios } from '../../../app/data/serviciosCatalogos';
import { SelectorCatalogo } from '../../../shared/components/SelectorCatalogo';
import { CampoTextoCatalogo } from '../../../shared/components/CampoTextoCatalogo';
import { EditorCatalogo } from './EditorCatalogo';

/** Inicializa un borrador visual; la identidad y auditoría se asignan al guardar. */
function crearMedio(): MedioPago {
  return { id: '', nombre: '', activo: true, icono: 'payments', color: null, orden: 0, mostrarEnCargaRapida: true, billeteraPredeterminadaId: null, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Administra medios y sus preferencias sin confundirlos con billeteras. */
export function CatalogoMediosPago() {
  const [billeteras, establecerBilleteras] = useState<readonly Billetera[]>([]);
  const [error, establecerError] = useState('');
  /** Resuelve nombres de destinos activos e inactivos conservando las preferencias existentes. */
  function cargar() {
    let vigente = true;
    /** Entrega destinos disponibles si la pantalla permanece abierta. */
    function completar(resultado: readonly Billetera[]) { if (vigente) establecerBilleteras(resultado); }
    /** Comunica fallos de lectura en vez de ocultar destinos. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudieron cargar las billeteras.'); }
    void listarCatalogo(servicioBilleteras).then(completar, fallar);
    /** Ignora actualizaciones visuales después de salir del catálogo. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, []);
  /** Proporciona opciones sin exponer entidades de persistencia al selector. */
  function opcion(billetera: Billetera) { return { id: billetera.id, nombre: billetera.nombre }; }
  /** Resume preferencias del medio sin usar nombres como reglas. */
  function detalle(medio: MedioPago) {
    /** Resuelve exclusivamente la preferencia del medio, sin reconstruir billeteras históricas. */
    function destino(billetera: Billetera) { return billetera.id === medio.billeteraPredeterminadaId; }
    const billetera = billeteras.find(destino);
    // El orden se edita en el diálogo; esta fila distingue destino sugerido y carga rápida.
    return <Stack spacing={0.5}><Typography variant="body2">Billetera predeterminada: {billetera ? `${billetera.nombre}${billetera.activo ? '' : ' (inactiva)'}` : medio.billeteraPredeterminadaId ? 'No disponible' : 'Sin sugerencia'}</Typography>{medio.mostrarEnCargaRapida && <Chip label="Carga rápida" color="success" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} />}</Stack>;
  }
  /** Busca el nombre visible del medio en el catálogo completo. */
  function textoBusqueda(medio: MedioPago) { return medio.nombre; }
  /** Presenta los campos particulares del medio, controlados por el borrador. */
  function campos(medio: MedioPago, actualizar: (cambios: Partial<MedioPago>) => void) {
    /** Actualiza el identificador visual del medio. */
    function icono(valor: string) { actualizar({ icono: valor || null }); }
    /** Actualiza el color opcional del catálogo. */
    function color(valor: string) { actualizar({ color: valor || null }); }
    /** Convierte únicamente el orden del catálogo, nunca dinero. */
    function orden(valor: string) { actualizar({ orden: Number(valor) }); }
    /** Selecciona el destino sugerido o conserva la ausencia de billetera. */
    function destino(valor: string) { actualizar({ billeteraPredeterminadaId: valor || null }); }
    /** Alterna la visibilidad de carga rápida sin cambiar su actividad. */
    function rapidez() { actualizar({ mostrarEnCargaRapida: !medio.mostrarEnCargaRapida }); }
    const opciones = billeteras.filter(/** Ofrece solamente destinos activos para preferencias nuevas. */ function activa(billetera) { return billetera.activo; }).map(opcion);
    const seleccionada = billeteras.find(esDestino);
    if (medio.billeteraPredeterminadaId && !opciones.some(esDestino)) opciones.push({ id: medio.billeteraPredeterminadaId, nombre: seleccionada ? `${seleccionada.nombre} (inactiva)` : 'Billetera no disponible' });
    /** Identifica una opción ya seleccionada para conservar referencias inactivas al editar. */
    function esDestino(candidata: { id: string }) { return candidata.id === medio.billeteraPredeterminadaId; }
    return <><SelectorIcono valor={medio.icono ?? 'payments'} alCambiar={icono} />
      <SelectorColor valor={medio.color} alCambiar={color} />
      <CampoTextoCatalogo etiqueta="Orden" valor={String(medio.orden)} alCambiar={orden} tipo="number" obligatorio />
      <SelectorCatalogo etiqueta="Billetera predeterminada (opcional)" valor={medio.billeteraPredeterminadaId ?? ''} opciones={opciones} alCambiar={destino} />
      <Alert severity="info">La billetera predeterminada solo sugiere el destino de nuevas operaciones. No cambia registros históricos.</Alert>
      <FormControlLabel label="Mostrar en carga rápida" control={<Switch checked={medio.mostrarEnCargaRapida} onChange={rapidez} />} /></>;
  }
  return <>{error && <Alert severity="error">{error}</Alert>}<EditorCatalogo singular="medio de pago" etiquetaCrear="Nuevo medio de pago" masculino alturaTarjeta={96} tamanoIcono={48} textoBusqueda={textoBusqueda} servicio={servicioMedios} crearNuevo={crearMedio} campos={campos} detalle={detalle} /></>;
}
