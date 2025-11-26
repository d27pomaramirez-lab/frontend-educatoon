import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeccionService } from '../../services/seccion.service';
import { SeccionResponse } from '../../dto/response/SeccionResponse';
import { SeccionRequest } from '../../dto/request/SeccionRequest';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-secciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion.secciones.component.html',
  styleUrl: './gestion.secciones.component.css'
})
export class GestionSeccionesComponent implements OnInit {

  seccionForm: FormGroup;
  seccionEditForm: FormGroup;

  listaSecciones: SeccionResponse[] = [];
  listaDocentes: UsuarioPendienteResponse[] = [];
  
  seccionEnEdicion: SeccionResponse | null = null;
  mostrarModalEdicion = false;

  formErrorMessage: string | null = null;
  formSuccessMessage: string | null = null;
  editFormErrorMessage: string | null = null;
  editFormSuccessMessage: string | null = null;
  tableErrorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private seccionService: SeccionService,
    private usuarioService: UsuarioService
  ) {
    this.seccionForm = this.fb.group({
      curso: ['', Validators.required],
      capacidad: [30, [Validators.required, Validators.min(1)]],
      aula: ['', Validators.required],
      docente: ['', Validators.required]
    });

    this.seccionEditForm = this.fb.group({
      curso: ['', Validators.required],
      capacidad: [30, [Validators.required, Validators.min(1)]],
      aula: ['', Validators.required],
      docente: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarSecciones();
    this.cargarDocentes();
  }

  cargarSecciones(): void {
    this.tableErrorMessage = null;
    this.seccionService.listarSecciones().subscribe({
      next: (data) => {
        this.listaSecciones = data;
      },
      error: (err) => {
        this.tableErrorMessage = 'Error al cargar las secciones.';
        console.error(err);
      }
    });
  }

  cargarDocentes(): void {
    this.usuarioService.getUsuariosParaCoordinador().subscribe({
      next: (data: UsuarioPendienteResponse[]) => {
        this.listaDocentes = data.filter(usuario => usuario.rolNombre === 'ROL_DOCENTE');
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  onSubmit(): void {
    this.formErrorMessage = null;
    this.formSuccessMessage = null;
    if (this.seccionForm.valid) {
      const request: SeccionRequest = this.seccionForm.value;
      this.seccionService.registrarSeccion(request).subscribe({
        next: (response) => {
          this.formSuccessMessage = response;
          this.cargarSecciones();
          this.seccionForm.reset({ capacidad: 30 });
        },
        error: (err) => {
          this.formErrorMessage = err.error?.message || 'Error al registrar la sección.';
        }
      });
    }
  }

  onEditar(seccion: SeccionResponse): void {
    this.seccionEnEdicion = seccion;
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;
    this.seccionEditForm.patchValue({
      curso: seccion.curso,
      capacidad: seccion.capacidad,
      aula: seccion.aula,
      docente: seccion.docente
    });
    this.mostrarModalEdicion = true;
  }


  onSubmitEdicion(): void {
    if (this.seccionEditForm.valid && this.seccionEnEdicion) {
      const request: SeccionRequest = this.seccionEditForm.value;
      this.seccionService.actualizarSeccion(this.seccionEnEdicion.id, request).subscribe({
        next: (seccionActualizada) => {
          this.editFormSuccessMessage = 'Sección actualizada correctamente.';
          this.cargarSecciones();
          setTimeout(() => this.cerrarModalEdicion(), 1500);
        },
        error: (err) => {
          this.editFormErrorMessage = err.error?.message || 'Error al actualizar la sección.';
        }
      });
    }
  }

  onEliminar(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir la eliminación de esta sección.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, se ejecuta la lógica de eliminación
        this.seccionService.eliminarSeccion(id).subscribe({
          next: () => {
            this.cargarSecciones();
            Swal.fire(
              '¡Eliminado!',
              'La sección ha sido eliminada correctamente.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Error',
              err.error?.message || 'No se pudo eliminar la sección.',
              'error'
            );
          }
        });
      }
    });
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.seccionEnEdicion = null;
  }
}