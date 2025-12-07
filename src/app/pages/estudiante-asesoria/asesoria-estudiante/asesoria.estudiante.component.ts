import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../../../utils/pagination.component';
import { AsesoriaResponse } from '../../../dto/response/AsesoriaResponse';
import { AsesoriaService } from '../../../services/asesoria.service';
import { PaginationService } from '../../../services/pagination.service';

@Component({
  selector: 'app-asesoria.estudiante.component',
  standalone: true,
  imports: [CommonModule, DatePipe, PaginationComponent],
  templateUrl: './asesoria.estudiante.component.html',
  styleUrl: './asesoria.estudiante.component.css',
})
export class GestionarAsesoriaEstudianteComponent implements OnInit {
  listaAsesorias: AsesoriaResponse[] = [];
  tableErrorMessage: string | null = null;
  successMessage: string | null = null; // Aunque no hay acciones, es bueno mantenerlo

  // Variables de Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  asesoriasPaginadas: AsesoriaResponse[] = [];

  constructor(
    private asesoriaService: AsesoriaService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.cargarAsesorias();
  }

  cargarAsesorias(): void {
    this.tableErrorMessage = null;
    this.successMessage = null;

    this.asesoriaService.listarAsesoriasEstudiante().subscribe({
      next: (data) => {
        this.listaAsesorias = data;
        this.aplicarPaginacion(this.paginaActual);
      },
      error: (err) => this.tableErrorMessage = err.error || 'Error al cargar sus asesorías programadas.'
    });
  }

  // Método unificado para aplicar y actualizar la paginación
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
}
