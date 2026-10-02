import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { servicioPatrimonio } from '../../app/data/servicioPatrimonio';
import type { ResumenPatrimonio } from '../../core/repositories/RepositorioPatrimonio';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';

/** Presenta patrimonio actual y movimientos internos con etiquetas que distinguen sus períodos. */
export function ResumenPatrimonial({ desde, hasta }: { desde: string; hasta: string }) {
  const [datos, establecerDatos] = useState<ResumenPatrimonio | null>(null); const [error, establecerError] = useState('');
  /** Recupera una lectura vigente y descarta respuestas de otros períodos. */
  function cargar() { let vigente = true; establecerDatos(null); establecerError('');
    /** Publica el reporte patrimonial solicitado. */
    function completar(resultado: ResumenPatrimonio) { if (vigente) establecerDatos(resultado); }
    /** Explica una falla de consulta. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el patrimonio.'); }
    void servicioPatrimonio.consultar(desde, hasta).then(completar, fallar);
    /** Evita publicar una respuesta desactualizada. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [desde, hasta]);
  /** Formatea un saldo sin convertir divisas. */
  function importe(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  return <Stack spacing={2}><Typography variant="h6">Patrimonio y movimientos internos</Typography><Typography color="text.secondary">El patrimonio refleja todos los movimientos registrados. Las transferencias y ajustes del período se muestran separados del resultado.</Typography>{error && <Alert severity="error">{error}</Alert>}
    {datos?.totales.map(function presentar(total) { return <Stack key={total.moneda} spacing={1}><TarjetaResumen titulo="Patrimonio líquido actual" valor={importe(total.saldoCentavos, total.moneda)} /><Typography>Transferencias internas del período: {importe(total.transferenciasCentavos, total.moneda)}</Typography><Typography>Ajustes positivos: {importe(total.ajustesPositivosCentavos, total.moneda)}</Typography><Typography>Ajustes negativos: {importe(total.ajustesNegativosCentavos, total.moneda)}</Typography></Stack>; })}
    {datos?.billeteras.map(function presentar({ billetera, saldoCentavos }) { return <Typography key={billetera.id}>{billetera.nombre}: {importe(saldoCentavos, billetera.moneda)}</Typography>; })}
  </Stack>;
}
