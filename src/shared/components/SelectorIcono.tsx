import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CampoTextoCatalogo } from './CampoTextoCatalogo';
import { IconoCatalogo, iconosCatalogo } from './IconoCatalogo';

/** Elección visual de un identificador Material Icons para actividades y catálogos. */
interface PropiedadesSelectorIcono { compacto?: boolean; valor: string | null; alCambiar: (valor: string) => void }

/** Permite buscar, previsualizar y seleccionar iconos con nombres españoles. */
export function SelectorIcono({ valor, alCambiar, compacto = false }: PropiedadesSelectorIcono) {
  const [busqueda, establecerBusqueda] = useState('');
  /** Compara nombres sin diferencias de mayúsculas ni tildes. */
  function normalizar(texto: string) { return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  /** Filtra por nombre visual o identificador técnico. */
  function coincide(icono: (typeof iconosCatalogo)[number]) { return normalizar(`${icono.nombre} ${icono.id}`).includes(normalizar(busqueda)); }
  /** Crea una opción con vista previa y estado seleccionado accesible. */
  function mostrar(icono: (typeof iconosCatalogo)[number]) {
    /** Cambia el identificador guardado, sin persistir todavía. */
    function seleccionar() { alCambiar(icono.id); }
    return <Button key={icono.id} variant={valor === icono.id ? 'outlined' : 'text'} aria-pressed={valor === icono.id} onClick={seleccionar} aria-label={icono.nombre} title={icono.nombre} sx={compacto ? { minWidth: 44, height: 48, bgcolor: 'action.hover', borderRadius: '12px' } : undefined} startIcon={compacto ? undefined : <icono.componente />}>{compacto ? <icono.componente /> : icono.nombre}</Button>;
  }
  if (compacto) return <Stack spacing={1}><Typography>Icono</Typography><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{iconosCatalogo.filter(/** Ofrece iconos habituales y conserva cualquier selección existente. */ function habitual(icono) { return ['account_balance', 'payments', 'credit_card', 'swap_horiz', 'account_balance_wallet', 'category', valor].includes(icono.id); }).map(mostrar)}</Box><details><summary>Más iconos</summary><SelectorIcono valor={valor} alCambiar={alCambiar} /></details></Stack>;
  const opciones = iconosCatalogo.filter(coincide);
  return <Stack spacing={1}><Typography variant="subtitle2">Icono</Typography>
    <Stack direction="row" spacing={1}><IconoCatalogo identificador={valor} /><Typography variant="body2">{valor ?? 'Sin icono'}</Typography></Stack>
    <CampoTextoCatalogo etiqueta="Buscar iconos" valor={busqueda} alCambiar={establecerBusqueda} />
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{opciones.map(mostrar)}</Box>
    {!opciones.length && <Typography color="text.secondary">No se encontraron iconos.</Typography>}
  </Stack>;
}
