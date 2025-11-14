import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;
    userEmail: string | null = null;
    isAdmin = false;
    isCoordinador = false;

    constructor(
      private storageService: StorageService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.storageService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;

        if (status) {
          const usuario = this.storageService.getUser();
          this.userEmail = usuario.email;
          
          const rol = usuario.authorities[0]?.authority;
          
          this.isAdmin = (rol === 'ROL_ADMINISTRADOR');
          this.isCoordinador = (rol === 'ROL_COORDINADOR');
        } else {
          this.userEmail = null;
          this.isAdmin = false;
          this.isCoordinador = false;
        }
      });
    }

    logout(): void {
      this.storageService.signOut();
      this.router.navigate(['/inicio']);
    }
}
