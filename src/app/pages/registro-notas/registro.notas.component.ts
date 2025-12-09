import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeccionResponse } from '../../dto/response/SeccionResponse';
import { EstudianteActaDTO } from '../../dto/response/EstudianteActaDTO';
import { NotasService } from '../../services/notas.service';
import { SeccionService } from '../../services/seccion.service';
import Swal from 'sweetalert2';
import { NotaEstudianteInput } from '../../dto/request/NotaEstudianteInput';
import { RegistroNotasRequest } from '../../dto/request/RegistroNotasRequest';

@Component({
  selector: 'app-registro.notas.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.notas.component.html',
  styleUrl: './registro.notas.component.css',
})
export class RegistroNotasComponent implements OnInit{
  secciones: SeccionResponse[] = [];

  // NUEVAS VARIABLES
  cursosUnicos: string[] = [];
  seccionesFiltradas: SeccionResponse[] = [];
  selectedCurso: string = '';

  mostrarModalNotas: boolean = false;
  estudianteEnEdicion: EstudianteActaDTO | null = null;

  selectedSeccionId: string = '';
  estudiantes: EstudianteActaDTO[] = [];
  loading: boolean = false;

  constructor(
    private notasService: NotasService,
    private seccionService: SeccionService
  ) {}

  ngOnInit(): void {
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.seccionService.listarSecciones().subscribe({
      next: (data) => {
        this.secciones = data;
        this.cursosUnicos = [...new Set(data.map(s => s.curso))].sort();
      },
      error: (err) => {
        console.error('Error al cargar secciones', err);
        Swal.fire('Error', 'No se pudieron cargar las secciones', 'error');
      }
    });
  }

  // NUEVO MÉTODO: Filtrar secciones cuando cambia el curso
  onCursoChange(): void {
    this.selectedSeccionId = ''; // Resetear sección seleccionada
    this.estudiantes = []; // Limpiar tabla
    
    if (this.selectedCurso) {
      this.seccionesFiltradas = this.secciones.filter(s => s.curso === this.selectedCurso);
    } else {
      this.seccionesFiltradas = [];
    }
  }

  // Agregamos el método para limpiar los filtros
  limpiarFiltros(): void {
    this.selectedCurso = '';
    this.selectedSeccionId = '';
    this.seccionesFiltradas = [];
    this.estudiantes = [];
  }

  onSeccionChange(): void {
    if (this.selectedSeccionId) {
      this.cargarActa(this.selectedSeccionId);
    } else {
      this.estudiantes = [];
    }
  }

  cargarActa(seccionId: string): void {
    this.loading = true;
    this.notasService.obtenerActaPorSeccion(seccionId).subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar acta', err);
        Swal.fire('Error', 'No se pudo cargar el acta de notas', 'error');
        this.loading = false;
      }
    });
  }

  // Método para abrir el modal
  abrirModalNotas(estudiante: EstudianteActaDTO): void {
    // Creamos una copia para no modificar la tabla directamente hasta guardar
    this.estudianteEnEdicion = { ...estudiante };
    this.mostrarModalNotas = true;
  }

  // Método para cerrar el modal
  cerrarModalNotas(): void {
    this.mostrarModalNotas = false;
    this.estudianteEnEdicion = null;
  }

  // Método para guardar los cambios del modal en la lista principal
  guardarCambiosModal(): void {
    if (this.estudianteEnEdicion) {
      const index = this.estudiantes.findIndex(e => e.detalleMatriculaId === this.estudianteEnEdicion!.detalleMatriculaId);
      if (index !== -1) {
        this.estudiantes[index] = { ...this.estudianteEnEdicion };
      }
      this.cerrarModalNotas();
    }
  }

  // Método auxiliar para calcular promedio (solo visualización)
  calcularPromedio(est: EstudianteActaDTO): number {
    const p = est.notaParcial || 0;
    const f = est.notaFinal || 0;
    const s = est.promedioSimulacros || 0;
    return (p + f + s) / 3;
  }

  guardarNotas(): void {
    if (!this.selectedSeccionId) return;

    const notasInput: NotaEstudianteInput[] = this.estudiantes.map(est => ({
      detalleMatriculaId: est.detalleMatriculaId,
      notaParcial: est.notaParcial,
      notaFinal: est.notaFinal,
      promedioSimulacros: est.promedioSimulacros,
      observaciones: est.observaciones
    }));

    const request: RegistroNotasRequest = {
      seccionId: this.selectedSeccionId,
      notas: notasInput
    };

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se actualizarán las notas de los estudiantes.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notasService.registrarNotas(request).subscribe({
          next: () => {
            Swal.fire('Guardado', 'Las notas han sido registradas exitosamente.', 'success');
            this.cargarActa(this.selectedSeccionId);
          },
          error: (err) => {
            console.error('Error al guardar notas', err);
            Swal.fire('Error', 'Ocurrió un error al guardar las notas.', 'error');
          }
        });
      }
    });
  }
}
