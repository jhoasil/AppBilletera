/** Normaliza texto para buscar sin distinguir tildes ni mayúsculas. */
export function normalizarBusqueda(texto: string) { return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-AR').trim(); }
