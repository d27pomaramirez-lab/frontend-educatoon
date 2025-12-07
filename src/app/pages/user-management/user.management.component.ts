import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { AdminCrearUsuarioRequest } from '../../dto/request/AdminCrearUsuarioRequest';
import { ActualizarUsuarioRequest } from '../../dto/request/ActualizarUsuarioRequest';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../../utils/pagination.component';
import { CursoComboboxResponse } from '../../dto/response/CursoComboBoxResponse';
import { CursoService } from '../../services/curso.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
    NgSelectModule
  ],
  templateUrl: './user.management.component.html',
  styleUrl: './user.management.component.css'
})
export class UserManagementComponent implements OnInit {

  userForm: FormGroup;

  userEditForm: FormGroup;
  mostrarModalEdicion: boolean = false;
  usuarioEnEdicion: UsuarioPendienteResponse | null = null;

  formErrorMessage: string | null = null;
  formSuccessMessage: string | null = null;
  editFormErrorMessage: string | null = null;
  editFormSuccessMessage: string | null = null;

  rolesDisponibles = ['ROL_DOCENTE', 'ROL_COORDINADOR', 'ROL_ADMINISTRADOR'];
  listaCursos: CursoComboboxResponse[] = [];

  todosLosUsuarios: UsuarioPendienteResponse[] = [];
  tableErrorMessage: string | null = null;
  showPassword = false;

  // Variables de Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  usuariosPaginadas: UsuarioPendienteResponse[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private paginationService: PaginationService,
    private cursoService: CursoService
  ) {
    this.userForm = new FormGroup({
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      telefono: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      estadoCivil: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombreRol: new FormControl(this.rolesDisponibles[0], [Validators.required]),
      especialidad: new FormControl(''),
      universidadPostular: new FormControl(''),
      carreraPostular: new FormControl(''),
      colegioProcedencia: new FormControl('')
    });

    this.userEditForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      estadoCivil: ['', [Validators.required]],
      especialidad: [''],
      universidadPostular: [''],
      carreraPostular: [''],
      colegioProcedencia: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.cargarTodosLosUsuarios();
    this.cargarCursosParaEspecialidad();
  }

  onSubmit() {
    this.formErrorMessage = null;
    this.formSuccessMessage = null;

    if (this.userForm.valid) {
      const formData = this.userForm.value as AdminCrearUsuarioRequest;

      this.usuarioService.crearUsuario(formData).subscribe({
        next: (response) => {
          this.formSuccessMessage = response;
          this.userForm.reset({
            nombreRol: this.rolesDisponibles[0],
            sexo: '',
            estadoCivil: ''
          });
          this.cargarTodosLosUsuarios();
        },
        error: (err) => {
          this.formErrorMessage = err.error || 'Error al crear el usuario.';
        }
      });
    }
  }

  cargarTodosLosUsuarios(): void {
    this.tableErrorMessage = null;
    this.usuarioService.getTodosLosUsuarios().subscribe({
      next: (data) => {
        this.todosLosUsuarios = data;
        this.aplicarPaginacion(this.paginaActual);
      },
      error: (err) => {
        this.tableErrorMessage = 'Error al cargar la lista de usuarios.';
        console.error(err);
      }
    });
  }

  cargarCursosParaEspecialidad(): void {
    this.cursoService.listarCursosParaCombobox().subscribe({
      next: (cursos) => {
        // Filtrar si es necesario (ej. solo cursos activos)
        this.listaCursos = cursos.filter(c => c.estado === true);
      },
      error: (err) => console.error('Error cargando cursos para especialidad', err)
    });
  }

  // Método unificado para aplicar y actualizar la paginación
  aplicarPaginacion(pagina: number): void {
    const { data, totalPages } = this.paginationService.getPaginatedData(
      this.todosLosUsuarios,
      pagina,
      this.elementosPorPagina
    );
    this.usuariosPaginadas = data;
    this.totalPaginas = totalPages;
    this.paginaActual = pagina;
  }

  onEditar(usuario: UsuarioPendienteResponse): void {
    this.usuarioEnEdicion = usuario;
    this.editFormSuccessMessage = null;
    this.editFormErrorMessage = null;

    const fechaNacimientoStr = formatDate(usuario.fechaNacimiento, 'yyyy-MM-dd', 'en-US');

    this.userEditForm.patchValue({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      fechaNacimiento: fechaNacimientoStr,
      sexo: usuario.sexo,
      estadoCivil: usuario.estadoCivil,
      especialidad: usuario.especialidad || '',
      universidadPostular: usuario.universidadPostular || '',
      carreraPostular: usuario.carreraPostular || '',
      colegioProcedencia: usuario.colegioProcedencia || '',
      email: usuario.email,
    });

    const especialidadControl = this.userEditForm.get('especialidad');
    const uniControl = this.userEditForm.get('universidadPostular');
    const carreraControl = this.userEditForm.get('carreraPostular');
    const colegioControl = this.userEditForm.get('colegioProcedencia');

    if (usuario.rolNombre === 'ROL_DOCENTE') {
      // Requerir (o al menos habilitar) especialidad, desactivar estudiante
      especialidadControl?.enable();
      uniControl?.disable();
      carreraControl?.disable();
      colegioControl?.disable();
    } else if (usuario.rolNombre === 'ROL_ESTUDIANTE') {
      // Requerir (o al menos habilitar) estudiante, desactivar especialidad
      especialidadControl?.disable();
      uniControl?.enable();
      carreraControl?.enable();
      colegioControl?.enable();
    } else {
      // Si es Admin/Coordinador, desactivar todos los campos específicos
      especialidadControl?.disable();
      uniControl?.disable();
      carreraControl?.disable();
      colegioControl?.disable();
    }

    this.mostrarModalEdicion = true;
  }

  onSubmitEdicion(): void {
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;

    if (!this.usuarioEnEdicion || !this.userEditForm.valid) {
      this.editFormErrorMessage = 'Formulario inválido o usuario no seleccionado.';
      return;
    }

    Swal.fire({
      title: '¿Confirmar Cambios?',
      text: "Se actualizarán los datos del usuario seleccionado.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Puedes personalizar el color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'No, cancelar'
    }).then((result: SweetAlertResult) => {

      if (result.isConfirmed) {
        const formValue = this.userEditForm.value;

        const request: ActualizarUsuarioRequest = {
          email: this.usuarioEnEdicion!.email,
          nombres: formValue.nombres,
          apellidos: formValue.apellidos,
          dni: this.usuarioEnEdicion!.dni,
          telefono: formValue.telefono,
          sexo: formValue.sexo,
          estadoCivil: formValue.estadoCivil,
          fechaNacimiento: formValue.fechaNacimiento,

          ...(this.usuarioEnEdicion!.rolNombre === 'ROL_DOCENTE' && { especialidad: formValue.especialidad }),
          ...(this.usuarioEnEdicion!.rolNombre === 'ROL_ESTUDIANTE' && {
            carreraPostular: formValue.carreraPostular,
            universidadPostular: formValue.universidadPostular,
            colegioProcedencia: formValue.colegioProcedencia
          })
        };

        this.usuarioService.actualizarUsuario(this.usuarioEnEdicion!.id, request).subscribe({
          next: (resp) => {
            Swal.fire({
              title: '¡Actualizado!',
              text: resp || 'Usuario actualizado correctamente.',
              icon: 'success'
            });

            this.editFormSuccessMessage = resp;
            this.cerrarModalEdicion();
            this.cargarTodosLosUsuarios();
          },
          error: (err) => {
            this.editFormErrorMessage = err.error || 'Error al actualizar el usuario.';
            // Mostrar SweetAlert2 de error
            Swal.fire('Error', this.editFormErrorMessage!, 'error');
          }
        });
      }
    });
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.usuarioEnEdicion = null;
    this.userEditForm.reset();
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;
  }

  onDesactivar(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El usuario será desactivado y no podrá iniciar sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡desactivar!',
      cancelButtonText: 'Cancelar'
    }).then((result: SweetAlertResult) => {

      if (result.isConfirmed) {
        this.usuarioService.desactivarUsuario(id).subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡Desactivado!',
              text: response || 'Usuario desactivado correctamente.',
              icon: 'success'
            });

            this.formSuccessMessage = response;
            this.cargarTodosLosUsuarios();
          },
          error: (err) => {
            this.formErrorMessage = err.error || 'Error al desactivar el usuario.';
            console.error(err);
            Swal.fire('Error', this.formErrorMessage!, 'error');
          }
        });
      }
    });
  }

  onActivar(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El usuario será activado y podrá iniciar sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡activar!',
      cancelButtonText: 'Cancelar'
    }).then((result: SweetAlertResult) => {

      if (result.isConfirmed) {
        this.usuarioService.activarUsuario(id).subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡activado!',
              text: response || 'Usuario activado correctamente.',
              icon: 'success'
            });

            this.formSuccessMessage = response;
            this.cargarTodosLosUsuarios();
          },
          error: (err) => {
            this.formErrorMessage = err.error || 'Error al activar el usuario.';
            console.error(err);
            Swal.fire('Error', this.formErrorMessage!, 'error');
          }
        });
      }
    });
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.showPassword = !this.showPassword;
  }
}