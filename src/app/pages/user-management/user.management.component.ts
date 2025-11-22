import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { AdminCrearUsuarioRequest } from '../../dto/request/AdminCrearUsuarioRequest';
import { ActualizarUsuarioRequest } from '../../dto/request/ActualizarUsuarioRequest';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
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

  todosLosUsuarios: UsuarioPendienteResponse[] = [];
  tableErrorMessage: string | null = null;
  showPassword = false;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
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
      },
      error: (err) => {
        this.tableErrorMessage = 'Error al cargar la lista de usuarios.';
        console.error(err);
      }
    });
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
      email: usuario.email,    
      especialidad: usuario.especialidad || '',
      universidadPostular: usuario.universidadPostular || '',
      carreraPostular: usuario.carreraPostular || '',
      colegioProcedencia: usuario.colegioProcedencia || ''
    });

    this.mostrarModalEdicion = true;
  }
  
  onSubmitEdicion(): void {
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;

    if (!this.usuarioEnEdicion || !this.userEditForm.valid) {
      this.editFormErrorMessage = 'Formulario inválido o usuario no seleccionado.';
      return;
    }
    
    if (confirm('¿Estás seguro de guardar los cambios del usuario?')) {
      const formValue = this.userEditForm.value;
      
      const request: ActualizarUsuarioRequest = {
        email: this.usuarioEnEdicion.email,
        nombres: formValue.nombres,
        apellidos: formValue.apellidos,
        dni: this.usuarioEnEdicion.dni,
        telefono: formValue.telefono,
        sexo: formValue.sexo,
        estadoCivil: formValue.estadoCivil,
        fechaNacimiento: formValue.fechaNacimiento,
        
        ...(this.usuarioEnEdicion.rolNombre === 'ROL_DOCENTE' && { especialidad: formValue.especialidad }),
        ...(this.usuarioEnEdicion.rolNombre === 'ROL_ESTUDIANTE' && {
            carreraPostular: formValue.carreraPostular,
            universidadPostular: formValue.universidadPostular,
            colegioProcedencia: formValue.colegioProcedencia
        })
      };
      
      this.usuarioService.actualizarUsuario(this.usuarioEnEdicion.id, request).subscribe({
        next: (resp) => {
          this.editFormSuccessMessage = resp;
          this.cerrarModalEdicion(); 
          this.cargarTodosLosUsuarios();
        },
        error: (err) => this.editFormErrorMessage = err.error || 'Error al actualizar el usuario.'
      });
    }
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.usuarioEnEdicion = null;
    this.userEditForm.reset();
    this.editFormErrorMessage = null;
    this.editFormSuccessMessage = null;
  }

  onDesactivar(id: string): void {
    if (confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      this.usuarioService.desactivarUsuario(id).subscribe({
        next: (response) => {
          this.formSuccessMessage = response;
          const usuario = this.todosLosUsuarios.find(u => u.id === id);
          if (usuario) {
            usuario.enabled = false;
          }
        },
        error: (err) => {
          this.formErrorMessage = err.error || 'Error al desactivar el usuario.';
          console.error(err);
        }
      });
    }
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.showPassword = !this.showPassword;
  }
}