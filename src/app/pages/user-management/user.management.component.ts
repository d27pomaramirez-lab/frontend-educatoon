import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { AdminCrearUsuarioRequest } from '../../dto/request/AdminCrearUsuarioRequest';

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
  formErrorMessage: string | null = null;
  formSuccessMessage: string | null = null;
  rolesDisponibles = ['ROL_DOCENTE', 'ROL_COORDINADOR', 'ROL_ADMINISTRADOR'];

  todosLosUsuarios: UsuarioPendienteResponse[] = [];
  tableErrorMessage: string | null = null;
  showPassword = false;

  constructor(private usuarioService: UsuarioService) {
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
          this.userForm.reset({ nombreRol: this.rolesDisponibles[0] });
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