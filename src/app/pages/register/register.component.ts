import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegistroEstudianteRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      telefono: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      estadoCivil: new FormControl('', [Validators.required]), 
      fechaNacimiento: new FormControl('', [Validators.required]),

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),

      carreraPostular: new FormControl('', [Validators.required]),
      universidadPostular: new FormControl('', [Validators.required]), 
      colegioProcedencia: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.valid) {
      console.log('Enviando solicitud:', this.registerForm.value);
      
      const requestData: RegistroEstudianteRequest = this.registerForm.value;

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta:', response);
          this.successMessage = response + " Serás redirigido al login.";
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          this.errorMessage = err.error || 'Error al enviar la solicitud.';
        }
      });
    }
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.showPassword = !this.showPassword;
  }


}
