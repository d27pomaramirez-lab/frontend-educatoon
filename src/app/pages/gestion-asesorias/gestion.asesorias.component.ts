import { CursoService } from './../../services/curso.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { AsesoriaResponse } from '../../dto/response/AsesoriaResponse';
import { AsesoriaService } from '../../services/asesoria.service';
import { CrearAsesoriaRequest } from '../../dto/request/CrearAsesoriaRequest';
import { ActualizarAsesoriaRequest } from '../../dto/request/ActualizarAsesoriaRequest';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../../utils/pagination.component';
import { CursoComboboxResponse } from '../../dto/response/CursoComboBoxResponse';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-gestion-asesorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, PaginationComponent, NgSelectModule],
  templateUrl: './gestion.asesorias.component.html',
  styleUrl: './gestion.asesorias.component.css',
})
export class GestionAsesoriasComponent implements OnInit {
  asesoriaForm: FormGroup;

  asesoriaEditForm: FormGroup;
  mostrarModalEdicion: boolean = false;
  asesoriaEnEdicion: AsesoriaResponse | null = null;

  formErrorMessage: string | null = null;
  formSuccessMessage: string | null = null;
  editFormErrorMessage: string | null = null;
  editFormSuccessMessage: string | null = null;


  listaEstudiantes: UsuarioPendienteResponse[] = [];
  listaDocentes: UsuarioPendienteResponse[] = [];
  listaCursos: CursoComboboxResponse[] = [];

  listaAsesorias: AsesoriaResponse[] = [];
  tableErrorMessage: string | null = null;

  // Variables de Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  asesoriasPaginadas: AsesoriaResponse[] = [];

  constructor(
    private asesoriaService: AsesoriaService,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private paginationService: PaginationService,
    private fb: FormBuilder
  ) {
    this.asesoriaForm = new FormGroup({
      estudianteId: new FormControl('', [Validators.required]),
      docenteId: new FormControl('', [Validators.required]),
      cursoId: new FormControl('', [Validators.required]),

      fecha: new FormControl('', [Validators.required]),
      hora: new FormControl('', [Validators.required]),
      duracionMinutos: new FormControl(60, [Validators.required, Validators.min(30)]),

      modalidad: new FormControl('VIRTUAL', [Validators.required]),
      enlaceReunion: new FormControl(''),
      lugarPresencial: new FormControl(''),

      tema: new FormControl('', [Validators.required]),
      areasRefuerzo: new FormControl('')
    });

    this.asesoriaEditForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      duracionMinutos: [60, [Validators.required, Validators.min(30)]],

      modalidad: ['VIRTUAL', [Validators.required]],
      enlaceReunion: [''],
      lugarPresencial: [''],

      tema: ['', [Validators.required]],
      areasRefuerzo: ['']
    });

  }

  get form() {
    return this.asesoriaForm.controls;
  }

  get editForm() {
    return this.asesoriaEditForm.controls;
  }

  ngOnInit(): void {
    this.cargarUsuariosParaCombos();
    this.cargarAsesorias();
    this.cargarCursosParaCombo();

    this.onModalidadChangeCreacion();

    this.asesoriaEditForm.get('modalidad')?.valueChanges.subscribe(() => {
      this.onModalidadChangeEdicion();
    });
  }

  cargarUsuariosParaCombos(): void {
    this.usuarioService.getUsuariosParaCoordinador().subscribe({
      next: (usuarios) => {
        this.listaEstudiantes = usuarios.filter(u => u.rolNombre === 'ROL_ESTUDIANTE' && u.enabled);
        this.listaDocentes = usuarios.filter(u => u.rolNombre === 'ROL_DOCENTE' && u.enabled);
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  cargarCursosParaCombo(): void {
    this.cursoService.listarCursosParaCombobox().subscribe({
      next: (cursos) => {
        this.listaCursos = cursos.filter(c => c.estado === true);;
      },
      error: (err) => console.error('Error cargando cursos', err)
    });
  }

  cargarAsesorias(): void {
    this.asesoriaService.listarAsesorias().subscribe({
      next: (data) => {
        this.listaAsesorias = data;
        this.aplicarPaginacion(this.paginaActual);
      },
      error: (err) => this.tableErrorMessage = 'Error al cargar la lista de asesorías.'
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

  onSubmit(): void {
    this.formErrorMessage = null;
    this.formSuccessMessage = null;

    if (this.asesoriaForm.valid) {
      const fechaInput = this.asesoriaForm.get('fecha')?.value;
      const horaInput = this.asesoriaForm.get('hora')?.value;
      const fechaCompletaISO = `${fechaInput}T${horaInput}:00`;

      const request: CrearAsesoriaRequest = {
        ...this.asesoriaForm.value,
        fecha: fechaCompletaISO
      };

      this.asesoriaService.crearAsesoria(request).subscribe({
        next: (resp) => {
          this.formSuccessMessage = resp;
          this.asesoriaForm.reset({
            modalidad: 'VIRTUAL',
            duracionMinutos: 60
          });
          this.onModalidadChangeCreacion();
          this.cargarAsesorias();
        },
        error: (err) => this.formErrorMessage = err.error || 'Error al programar.'
      });
    }
  }

  onEditar(asesoria: AsesoriaResponse): void {
    this.asesoriaEnEdicion = asesoria;
    this.editFormSuccessMessage = null;
    this.editFormErrorMessage = null;

    const fechaObj = new Date(asesoria.fecha);
    const fechaStr = formatDate(fechaObj, 'yyyy-MM-dd', 'en-US');
    const horaStr = formatDate(fechaObj, 'HH:mm', 'en-US');

    const ubicacion = asesoria.ubicacion;

    this.asesoriaEditForm.patchValue({
      fecha: fechaStr,
      hora: horaStr,
      duracionMinutos: asesoria.duracionMinutos,
      modalidad: asesoria.modalidad,
      enlaceReunion: asesoria.modalidad === 'VIRTUAL' ? ubicacion : '',
      lugarPresencial: asesoria.modalidad === 'PRESENCIAL' ? ubicacion : '',
      tema: asesoria.tema,
      areasRefuerzo: asesoria.areasRefuerzo
    });

    this.onModalidadChangeEdicion();
    this.mostrarModalEdicion = true;
  }

  onSubmitEdicion(): void {
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;

    if (!this.asesoriaEnEdicion || !this.asesoriaEditForm.valid) {
      this.editFormErrorMessage = 'Formulario inválido o asesoría no seleccionada.';
      Swal.fire('Error de Validación', this.editFormErrorMessage, 'error');
      return;
    }

    Swal.fire({
      title: '¿Confirmar Edición?',
      text: "¿Estás seguro de guardar los cambios en esta asesoría?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a744',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'Cancelar'
    }).then((result: SweetAlertResult) => {

      if (result.isConfirmed) {
        const fechaInput = this.asesoriaEditForm.get('fecha')?.value;
        const horaInput = this.asesoriaEditForm.get('hora')?.value;
        const fechaCompletaISO = `${fechaInput}T${horaInput}:00`;

        const request: ActualizarAsesoriaRequest = {
          fecha: fechaCompletaISO,
          duracionMinutos: this.asesoriaEditForm.get('duracionMinutos')?.value,
          modalidad: this.asesoriaEditForm.get('modalidad')?.value,
          enlaceReunion: this.asesoriaEditForm.get('enlaceReunion')?.value,
          lugarPresencial: this.asesoriaEditForm.get('lugarPresencial')?.value,
          tema: this.asesoriaEditForm.get('tema')?.value,
          areasRefuerzo: this.asesoriaEditForm.get('areasRefuerzo')?.value
        };

        this.asesoriaService.actualizarAsesoria(this.asesoriaEnEdicion!.id, request).subscribe({
          next: (resp) => {
            Swal.fire({
              title: '¡Actualizado!',
              text: resp || 'Cambios guardados exitosamente.',
              icon: 'success'
            });
            this.editFormSuccessMessage = resp;
            this.cerrarModalEdicion();
            this.cargarAsesorias();
          },
          error: (err) => {
            const errorMessage = err.error || 'Error al actualizar.';
            Swal.fire('Error', errorMessage, 'error');
            this.editFormErrorMessage = errorMessage;
          }
        });
      }
    });
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.asesoriaEnEdicion = null;
    this.asesoriaEditForm.reset({
      modalidad: 'VIRTUAL',
      duracionMinutos: 60
    });
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;
    this.onModalidadChangeEdicion();
  }

  onEliminar(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se cancelará esta asesoría. Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar asesoría',
      cancelButtonText: 'No, mantener'
    }).then((result: SweetAlertResult) => {

      if (result.isConfirmed) {
        this.asesoriaService.cancelarAsesoria(id).subscribe({
          next: (resp) => {
            Swal.fire({
              title: '¡Cancelada!',
              text: resp || 'La asesoría ha sido cancelada exitosamente.',
              icon: 'success'
            });
            this.formSuccessMessage = resp;
            this.cargarAsesorias();
          },
          error: (err) => {
            const errorMessage = err.error || 'Error al cancelar la asesoría.';
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }

  onModalidadChangeCreacion(): void {
    const modalidad = this.asesoriaForm.get('modalidad')?.value;
    const enlaceControl = this.asesoriaForm.get('enlaceReunion');
    const lugarControl = this.asesoriaForm.get('lugarPresencial');

    if (modalidad === 'VIRTUAL') {
      enlaceControl?.setValidators([Validators.required]);
      lugarControl?.clearValidators();
    } else {
      lugarControl?.setValidators([Validators.required]);
      enlaceControl?.clearValidators();
    }
    enlaceControl?.updateValueAndValidity();
    lugarControl?.updateValueAndValidity();
  }

  onModalidadChangeEdicion(): void {
    const modalidad = this.asesoriaEditForm.get('modalidad')?.value;
    const enlaceControl = this.asesoriaEditForm.get('enlaceReunion');
    const lugarControl = this.asesoriaEditForm.get('lugarPresencial');

    if (modalidad === 'VIRTUAL') {
      enlaceControl?.setValidators([Validators.required]);
      lugarControl?.clearValidators();
    } else {
      lugarControl?.setValidators([Validators.required]);
      enlaceControl?.clearValidators();
    }
    enlaceControl?.updateValueAndValidity();
    lugarControl?.updateValueAndValidity();
  }
}