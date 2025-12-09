// gestionar.asesoria.docente.component.ts (Docente)

import { Component, OnInit } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AsesoriaResponse } from '../../dto/response/AsesoriaResponse';
import { AsesoriaService } from '../../services/asesoria.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationComponent } from '../../../utils/pagination.component';
import { PaginationService } from '../../services/pagination.service';


@Component({
  selector: 'app-gestionar.asesoria.docente.component',
  standalone: true,
  imports: [CommonModule, PaginationComponent], 
  templateUrl: './gestionar.asesoria.docente.component.html',
  styleUrl: './gestionar.asesoria.docente.component.css',
})
export class GestionarAsesoriaDocenteComponent implements OnInit{
  listaAsesorias: AsesoriaResponse[] = [];
  tableErrorMessage: string | null = null;
  successMessage: string | null = null;

  // Variables de Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  asesoriasPaginadas: AsesoriaResponse[] = [];
  
  // Variables para filtros de búsqueda
  cursosFiltro: string[] = []; 
  seccionesFiltro: string[] = []; 
  
  filtroCursoSeleccionado: string = '';
  filtroSeccionSeleccionada: string = '';

  // Inyectar el PaginationService
  constructor(
    private asesoriaService: AsesoriaService,
    private paginationService: PaginationService // Nuevo
  ) { }

  ngOnInit(): void {
    this.cargarAsesorias();
  }

  cargarAsesorias(): void {
    this.tableErrorMessage = null;
    this.successMessage = null;
    
    this.asesoriaService.listarAsesoriasDocente().subscribe({
      next: (data) => {
        this.listaAsesorias = data;
        this.aplicarPaginacion(this.paginaActual); // Aplicar paginación
      },
      error: (err) => this.tableErrorMessage = err.error || 'Error al cargar sus asesorías asignadas.'
    });
  }

  aplicarPaginacion(pagina: number): void {
    const { data, totalPages } = this.paginationService.getPaginatedData(
      this.listaAsesorias,
      pagina,
      this.elementosPorPagina
    );
    this.asesoriasPaginadas = data;
    this.totalPaginas = totalPages;
    this.paginaActual = pagina;
  }

  onCambiarEstado(id: string, nuevoEstado: 'REALIZADA' | 'CANCELADA'): void {
    const estadoDisplay = nuevoEstado === 'REALIZADA' ? 'realizada' : 'cancelada';
    
    Swal.fire({
      title: `¿Confirmar ${estadoDisplay}?`,
      text: `Se marcará la asesoría como ${estadoDisplay}.`,
      icon: nuevoEstado === 'REALIZADA' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${estadoDisplay}`,
      cancelButtonText: 'No, mantener'
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.asesoriaService.cambiarEstadoDocente(id, nuevoEstado).subscribe({
          next: (resp) => {
            this.successMessage = resp;
            this.cargarAsesorias();
          },
          error: (err) => {
            this.tableErrorMessage = err.error || `Error al marcar como ${estadoDisplay}.`;
            Swal.fire('Error', this.tableErrorMessage!, 'error');
          }
        });
      }
    });
  }
}
