/** Convierte texto decimal a centavos exactos, sin multiplicar números de punto flotante. */
export function interpretarImporte(texto: string): number {
  const coincidencia = /^([+-]?)(\d+)(?:[,.](\d{1,2}))?$/.exec(texto.trim());
  if (!coincidencia) throw new Error('Indicá un importe como 1500,25, sin separadores de miles y con hasta dos decimales.');
  const centavos = (BigInt(coincidencia[2]!) * 100n + BigInt((coincidencia[3] ?? '').padEnd(2, '0'))) * (coincidencia[1] === '-' ? -1n : 1n);
  if (centavos > BigInt(Number.MAX_SAFE_INTEGER) || centavos < BigInt(Number.MIN_SAFE_INTEGER)) throw new Error('El importe supera el rango admitido.');
  return Number(centavos);
}
