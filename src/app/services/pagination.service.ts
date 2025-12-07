import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  /**
   * Calcula los datos de la página actual para la paginación del lado del cliente.
   * @param listaCompleta El array completo de datos.
   * @param paginaActual El número de página actual (base 1).
   * @param elementosPorPagina El número de elementos por página.
   * @returns Un objeto con la lista paginada y el total de páginas.
   */
  public getPaginatedData<T>(listaCompleta: T[], paginaActual: number, elementosPorPagina: number): { data: T[], totalPages: number } {
    const totalPages = Math.ceil(listaCompleta.length / elementosPorPagina);
    
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPages && totalPages > 0) paginaActual = totalPages;

    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const data = listaCompleta.slice(inicio, fin);
    
    return { data, totalPages };
  }
}