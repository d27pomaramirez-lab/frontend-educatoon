// en src/app/pages/admin-panel/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService, AdminCrearUsuarioRequest, UsuarioPendienteDTO } from '../../services/usuario.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.panel.component.html',
  styleUrl: './admin.panel.component.css'
})
export class AdminPanelComponent {

  userForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  rolesDisponibles = ['ROL_DOCENTE', 'ROL_COORDINADOR', 'ROL_ADMINISTRADOR'];

  usuariosPendientes: UsuarioPendienteDTO[] = [];

  constructor(private usuarioService: UsuarioService) {
    this.userForm = new FormGroup({
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombreRol: new FormControl(this.rolesDisponibles[0], [Validators.required]),
      especialidad: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes(): void {
    this.usuarioService.getUsuariosPendientes().subscribe({
      next: (data) => {
        this.usuariosPendientes = data;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios pendientes.';
        console.error(err);
      }
    });
  }

  onAprobar(id: string): void {
    this.usuarioService.aprobarUsuario(id).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.cargarPendientes(); 
      },
      error: (err) => {
        this.errorMessage = err.error || 'Error al aprobar el usuario.';
        console.error(err);
      }
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.userForm.valid) {
      const formData = this.userForm.value as AdminCrearUsuarioRequest;
      console.log('Enviando datos de nuevo usuario:', formData);

      this.usuarioService.crearUsuario(formData).subscribe({
        next: (response) => {
          this.successMessage = response;
          this.userForm.reset({
            nombreRol: this.rolesDisponibles[0]
          });
        },
        error: (err) => {
          this.errorMessage = err.error || 'Error al crear el usuario.';
        }
      });
    }
  }


}