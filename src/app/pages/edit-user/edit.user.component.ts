// en src/app/pages/edit-user/edit-user.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService, ActualizarUsuarioRequest, UsuarioPendienteDTO } from '../../services/usuario.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit.user.component.html',
  styleUrl: './edit.user.component.css'
})
export class EditUserComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  rolesDisponibles = ['ROL_DOCENTE', 'ROL_COORDINADOR', 'ROL_ADMINISTRADOR'];
  currentUserId: string | null = null;
  isLoading = true;
  passwordLocked = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    this.userForm = new FormGroup({
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      telefono: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      estadoCivil: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl({ value: '', disabled: true }),
      nombreRol: new FormControl({ value: '', disabled: true }),
      especialidad: new FormControl(''),
      carreraPostular: new FormControl(''),
      universidadPostular: new FormControl(''),
      colegioProcedencia: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.route.snapshot.paramMap.get('id');

    if (this.currentUserId) {
      this.usuarioService.getUsuarioById(this.currentUserId).subscribe({
        next: (data) => {
          this.preRellenarFormulario(data);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = "Error al cargar los datos del usuario.";
          this.isLoading = false;
        }
      });
    }
  }

  preRellenarFormulario(usuario: UsuarioPendienteDTO): void {
    this.userForm.patchValue({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      telefono: usuario.telefono,
      sexo: usuario.sexo,
      estadoCivil: usuario.estadoCivil,
      fechaNacimiento: formatDate(usuario.fechaNacimiento, 'yyyy-MM-dd', 'en-US'),
      email: usuario.email,
      nombreRol: usuario.rolNombre,
      especialidad: usuario.especialidad,
      carreraPostular: usuario.carreraPostular,
      universidadPostular: usuario.universidadPostular,
      colegioProcedencia: usuario.colegioProcedencia
    });
  }

  togglePasswordLock(event: Event): void {
    event.preventDefault();
    this.passwordLocked = !this.passwordLocked;

    if (this.passwordLocked) {
      this.userForm.get('password')?.disable();
      this.userForm.get('password')?.setValue('');
    } else {
      this.userForm.get('password')?.enable();
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.userForm.pristine) {
      this.errorMessage = "No has realizado ningún cambio.";
      return;
    }
    if (!this.currentUserId || this.userForm.invalid) {
      this.errorMessage = "Por favor, complete todos los campos requeridos.";
      return;
    }
    if (!confirm('¿Estás seguro de que deseas guardar los cambios?')) {
      return; 
    }

    const requestData: ActualizarUsuarioRequest = this.userForm.value;

    this.usuarioService.actualizarUsuario(this.currentUserId, requestData).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.userForm.markAsPristine();
        setTimeout(() => {
          this.router.navigate(['/gestion-usuarios']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Error al actualizar el usuario.';
      }
    });
  }

  onVolver(): void {
    
    if (this.userForm.pristine) {
      this.router.navigate(['/gestion-usuarios']);
    } else {
      const confirmacion = confirm('Tienes cambios sin guardar. ¿Estás seguro de que deseas descartarlos?');
      if (confirmacion) {
        this.router.navigate(['/gestion-usuarios']);
      }
    }
  }


}
