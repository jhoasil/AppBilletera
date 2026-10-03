import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IconoCatalogo } from './IconoCatalogo';
import type { BilleteraConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../money/formatearImporte';

/** Selección visual de una billetera; los saldos ya vienen resueltos por el servicio. */
export function SelectorBilletera({ etiqueta, valor, opciones, alCambiar }: { etiqueta: string; valor: string; opciones: readonly BilleteraConSaldo[]; alCambiar: (id: string) => void }) {
  /** Comunica la selección sin calcular ni modificar datos financieros. */
  function cambiar(evento: { target: { value: unknown } }) { if (typeof evento.target.value === 'string') alCambiar(evento.target.value); }
  /** Muestra nombre, icono y saldo actual con su moneda real. */
  function presentar({ billetera, saldoCentavos }: BilleteraConSaldo) {
    return <MenuItem key={billetera.id} value={billetera.id}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', minWidth: 0 }}><IconoCatalogo identificador={billetera.icono} /><Box sx={{ minWidth: 0 }}><Typography noWrap>{billetera.nombre}</Typography><Typography variant="body2" color="text.secondary">{formatearImporte(crearImporte(saldoCentavos, billetera.moneda))} · {billetera.moneda}</Typography></Box></Box></MenuItem>;
  }
  return <TextField select required label={etiqueta} value={valor} onChange={cambiar} disabled={!opciones.length} helperText={!opciones.length ? 'No hay billeteras compatibles disponibles.' : ' '} sx={{ '& .MuiOutlinedInput-root': { minHeight: 64 } }}><MenuItem value="">Seleccioná una billetera</MenuItem>{opciones.map(presentar)}</TextField>;
}
