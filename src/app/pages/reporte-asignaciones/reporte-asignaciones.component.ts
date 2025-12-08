import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PruebaEntradaService } from '../../services/prueba-entrada.service';
import { AsignacionAulaDTO } from '../../dto/response/AsignacionAulaDTO';

@Component({
  selector: 'app-reporte-asignaciones.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-asignaciones.component.html',
  styleUrl: './reporte-asignaciones.component.css',
})

export class ReporteAsignacionesComponent implements OnInit {
  asignaciones: AsignacionAulaDTO[] = [];
  asignacionesFiltradas: AsignacionAulaDTO[] = [];
  
  // Filtros
  filtroPerfil: string = '';
  filtroEstado: string = '';
  filtroFechaInicio?: Date;
  filtroFechaFin?: Date;
  
  // Estadísticas
  totalAsignaciones: number = 0;
  asignacionesExitosas: number = 0;
  porcentajeAsignacion: number = 0;
  perfilMasComun: string = 'N/A';
  
  // Estados
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(private pruebaEntradaService: PruebaEntradaService) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte(): void {
    this.cargando = true;
    
    this.pruebaEntradaService.obtenerReporteAsignaciones().subscribe({
      next: (asignaciones) => {
        this.asignaciones = asignaciones;
        this.asignacionesFiltradas = asignaciones;
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar reporte: ' + error.message);
        this.cargando = false;
      }
    });
  }

  filtrarReporte(): void {
    this.asignacionesFiltradas = this.asignaciones.filter(asignacion => {
      const coincideEstado = this.filtroEstado === '' || 
        asignacion.estado === this.filtroEstado;
      
      // Aquí podrías agregar filtro por fecha si las asignaciones tienen fecha
      // const coincideFecha = this.filtrarPorFecha(asignacion);
      
      return coincideEstado; // && coincideFecha;
    });
    
    this.calcularEstadisticasFiltradas();
  }

  calcularEstadisticas(): void {
    this.totalAsignaciones = this.asignaciones.length;
    this.asignacionesExitosas = this.asignaciones.filter(a => a.estado === 'MATRICULADO').length;
    this.porcentajeAsignacion = this.totalAsignaciones > 0 ? 
      Math.round((this.asignacionesExitosas / this.totalAsignaciones) * 100) : 0;
    
    this.calcularPerfilMasComun();
  }

  calcularEstadisticasFiltradas(): void {
    this.totalAsignaciones = this.asignacionesFiltradas.length;
    this.asignacionesExitosas = this.asignacionesFiltradas.filter(a => a.estado === 'MATRICULADO').length;
    this.porcentajeAsignacion = this.totalAsignaciones > 0 ? 
      Math.round((this.asignacionesExitosas / this.totalAsignaciones) * 100) : 0;
  }

  calcularPerfilMasComun(): void {
  }

  exportarPDF(): void {
    alert('Funcionalidad de exportar PDF en desarrollo');
    // Implementar lógica de exportación a PDF
  }

  exportarExcel(): void {
    alert('Funcionalidad de exportar Excel en desarrollo');
    // Implementar lógica de exportación a Excel
  }

  obtenerColorPerfil(perfil: string): string {
    switch(perfil) {
      case 'VISUAL': return 'bg-info';
      case 'AUDITIVO': return 'bg-primary';
      case 'KINESTÉSICO': return 'bg-warning';
      case 'MIXTO': return 'bg-secondary';
      default: return 'bg-dark';
    }
  }

  obtenerColorEstado(estado: string): string {
    switch(estado) {
      case 'MATRICULADO': return 'bg-success';
      case 'ASIGNADO': return 'bg-warning';
      case 'ERROR_MATRICULA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => this.mensajeError = '', 5000);
  }
}