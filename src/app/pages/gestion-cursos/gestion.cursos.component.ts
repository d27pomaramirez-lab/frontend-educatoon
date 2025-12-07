import { PaginationService } from './../../services/pagination.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursoResponse } from '../../dto/response/CursoResponse';
import { CursoService } from '../../services/curso.service';
import { CursoRequest } from '../../dto/request/CursoRequest';
import { ActualizarCursoRequest } from '../../dto/request/ActualizarCursoRequest';
import Swal from 'sweetalert2';
import { SweetAlertResult } from 'sweetalert2';
import { PaginationComponent } from '../../../utils/pagination.component';

@Component({
  selector: 'app-gestion-cursos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './gestion.cursos.component.html',
  styleUrl: './gestion.cursos.component.css',
})
export class GestionCursosComponent implements OnInit {
  cursoForm: FormGroup;

  cursoEditForm: FormGroup;
  mostrarModalEdicion: boolean = false;
  cursoEnEdicion: CursoResponse | null = null;
  listaCursos: CursoResponse[] = [];

  formErrorMessage: string | null = null;
  formSuccessMessage: string | null = null;
  tableErrorMessage: string | null = null;
  editFormErrorMessage: string | null = null;
  editFormSuccessMessage: string | null = null;

  // Variables de Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  cursosPaginadas: CursoResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private paginationService: PaginationService
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(255)]],
      ciclo: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.cursoEditForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(255)]],
      ciclo: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.tableErrorMessage = null;
    this.cursoService.listarCursos().subscribe({
      next: (data) => {
        this.listaCursos = data;
        this.aplicarPaginacion(this.paginaActual);
      },
      error: (err) => this.tableErrorMessage = 'Error al cargar la lista de cursos.'
    });
  }

  onSubmit(): void {
    this.formErrorMessage = null;
    this.formSuccessMessage = null;

    if (this.cursoForm.invalid) {
      return;
    }

    const request: CursoRequest = this.cursoForm.value as CursoRequest;

    this.cursoService.crearCurso(request).subscribe({
      next: (resp) => {
        this.formSuccessMessage = `Curso "${resp.nombre}" creado correctamente.`;
        this.cursoForm.reset();
        this.cargarCursos();
      },
      error: (err) => this.formErrorMessage = err.error || 'Error al crear el curso.'
    });
  }

  // Método unificado para aplicar y actualizar la paginación
  aplicarPaginacion(pagina: number): void {
    const { data, totalPages } = this.paginationService.getPaginatedData(
      this.listaCursos,
      pagina,
      this.elementosPorPagina
    );
    this.cursosPaginadas = data;
    this.totalPaginas = totalPages;
    this.paginaActual = pagina;
  }

  onEditar(curso: CursoResponse): void {
    this.cursoEnEdicion = curso;
    this.editFormSuccessMessage = null;
    this.editFormErrorMessage = null;
    this.mostrarModalEdicion = true;

    this.cursoEditForm.patchValue({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      ciclo: curso.ciclo
    });
  }

  onSubmitEdicion(): void {
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;

    if (!this.cursoEnEdicion || this.cursoEditForm.invalid) {
      this.editFormErrorMessage = 'Formulario inválido o curso no seleccionado.';
      return;
    }

    // Usamos SweetAlert2 para la confirmación
    Swal.fire({
      title: '¿Guardar cambios?',
      text: "Se actualizará la información del curso.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar'
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        const request: ActualizarCursoRequest = this.cursoEditForm.value as ActualizarCursoRequest;
        const id = this.cursoEnEdicion!.id;

        this.cursoService.actualizarCurso(id, request).subscribe({
          next: (resp) => {
            this.editFormSuccessMessage = `Curso "${resp.nombre}" actualizado.`;
            this.cargarCursos();
            this.cerrarModalEdicion();
            this.formSuccessMessage = `Curso "${resp.nombre}" actualizado correctamente.`;
          },
          error: (err) => {
            this.editFormErrorMessage = err.error || 'Error al actualizar el curso.';
          }
        });
      }
    });
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.cursoEnEdicion = null;
    this.cursoEditForm.reset();
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;
  }

  onCambiarEstado(id: string, nombre: string, estadoActual: boolean): void {
    const nuevoEstado = !estadoActual;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    if (confirm(`¿Estás seguro de que deseas ${accion} el curso "${nombre}"?`)) {
      this.cursoService.cambiarEstado(id, nuevoEstado).subscribe({
        next: (resp) => {
          this.formSuccessMessage = resp;
          this.cargarCursos();
        },
        error: (err) => this.formErrorMessage = err.error || `Error al ${accion} el curso.`
      });
    }
  }
}
