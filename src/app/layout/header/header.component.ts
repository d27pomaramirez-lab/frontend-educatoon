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
  styleUrls: ['./header.component.css']
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

    scrollToSection(section: string): void {
      // Si estamos en otra página, ir al inicio primero
      if (this.router.url !== '/inicio') {
        this.router.navigate(['/inicio']).then(() => {
          setTimeout(() => this.scrollToElement(section), 100);
        });
      } else {
        this.scrollToElement(section);
      }
    }

    private scrollToElement(section: string): void {
      const element = document.getElementById(section);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    logout(): void {
      this.storageService.signOut();
      this.router.navigate(['/inicio']);
    }
}