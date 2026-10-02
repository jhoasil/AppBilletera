import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import type { MedioPago } from '../../../nucleo/entidades/MedioPago';
import type { Billetera } from '../../../nucleo/entidades/Billetera';
import { listarBilleterasActivas, servicioMedios } from '../../../app/datos/serviciosCatalogos';
import { SelectorCatalogo } from '../../../compartido/componentes/SelectorCatalogo';
import { CampoTextoCatalogo } from './CampoTextoCatalogo';
import { EditorCatalogo } from './EditorCatalogo';

/** Inicializa un borrador visual; la identidad y auditoría se asignan al guardar. */
function crearMedio(): MedioPago {
  return { id: '', nombre: '', activo: true, icono: 'payments', color: null, orden: 0, mostrarEnCargaRapida: true, billeteraPredeterminadaId: null, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Administra medios y sus preferencias sin confundirlos con billeteras. */
export function CatalogoMediosPago() {
  const [billeteras, establecerBilleteras] = useState<readonly Billetera[]>([]);
  const [error, establecerError] = useState('');
  /** Consulta destinos activos al abrir el catálogo. */
  function cargar() {
    let vigente = true;
    /** Entrega destinos disponibles si la pantalla permanece abierta. */
    function completar(resultado: readonly Billetera[]) { if (vigente) establecerBilleteras(resultado); }
    /** Comunica fallos de lectura en vez de ocultar destinos. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudieron cargar las billeteras.'); }
    void listarBilleterasActivas().then(completar, fallar);
    /** Ignora actualizaciones visuales después de salir del catálogo. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, []);
  /** Proporciona opciones sin exponer entidades de persistencia al selector. */
  function opcion(billetera: Billetera) { return { id: billetera.id, nombre: billetera.nombre }; }
  /** Resume preferencias del medio sin usar nombres como reglas. */
  function detalle(medio: MedioPago) { return `${medio.activo ? 'Activo' : 'Inactivo'} · ${medio.mostrarEnCargaRapida ? 'En carga rápida' : 'Fuera de carga rápida'} · Orden ${medio.orden}`; }
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
    const opciones = billeteras.map(opcion);
    if (medio.billeteraPredeterminadaId && !opciones.some(esDestino)) opciones.push({ id: medio.billeteraPredeterminadaId, nombre: 'Billetera actual (inactiva)' });
    /** Identifica una opción ya seleccionada para conservar referencias inactivas al editar. */
    function esDestino(candidata: { id: string }) { return candidata.id === medio.billeteraPredeterminadaId; }
    return <><CampoTextoCatalogo etiqueta="Identificador del icono" valor={medio.icono ?? ''} alCambiar={icono} />
      <CampoTextoCatalogo etiqueta="Color hexadecimal (opcional)" valor={medio.color ?? ''} alCambiar={color} />
      <CampoTextoCatalogo etiqueta="Orden" valor={String(medio.orden)} alCambiar={orden} tipo="number" obligatorio />
      <SelectorCatalogo etiqueta="Billetera predeterminada (opcional)" valor={medio.billeteraPredeterminadaId ?? ''} opciones={opciones} alCambiar={destino} />
      <FormControlLabel label="Mostrar en carga rápida" control={<Switch checked={medio.mostrarEnCargaRapida} onChange={rapidez} />} /></>;
  }
  return <>{error && <Alert severity="error">{error}</Alert>}<EditorCatalogo singular="medio de pago" servicio={servicioMedios} crearNuevo={crearMedio} campos={campos} detalle={detalle} /></>;
}
