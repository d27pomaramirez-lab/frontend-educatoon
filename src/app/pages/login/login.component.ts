import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    
    loginForm: FormGroup;
    errorMessage: string | null = null;

    constructor(
      private authService: AuthService,
      private router: Router,
      private storageService: StorageService
    ) {
      this.loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
      });
    }

    onSubmit() {
      this.errorMessage = null;
      
      if (this.loginForm.valid) {
        console.log('Enviando datos:', this.loginForm.value);

        this.authService.login(this.loginForm.value).subscribe({
          
          next: (response) => {
            console.log('¡Login exitoso!', response);
            //console.log('Token:', response.token);
            this.storageService.saveToken(response.token);
            
            this.router.navigate(['/dashboard']);
          },        
          error: (err) => {
            console.error('Error en el login:', err);
            
            if (err.status === 401 || err.status === 403) {
              this.errorMessage = 'Correo o contraseña incorrectos.';
            } else {
              this.errorMessage = 'Error inesperado. Por favor, intente más tarde.';
            }
          }
        });
      } else {
        console.log('Formulario no válido');
      }
    }

}
