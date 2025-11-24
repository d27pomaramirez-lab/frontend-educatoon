import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ 
    RouterModule, 
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  @Input() isCollapsed = false; 
  @Output() toggleRequest = new EventEmitter<void>();

  isLoggedIn = false;
  userFullName: string | null = null;
  userProfileImage: string | null = null;
  isAdmin = false;
  isCoordinador = false;
  userEmail: string | null = null;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.storageService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const usuario = this.storageService.getUser(); 
        
        this.userEmail = usuario.email;
        this.userFullName = `${usuario.nombres} ${usuario.apellidos}`;
        const rol = usuario.authorities[0]?.authority;
        this.isAdmin = (rol === 'ROL_ADMINISTRADOR');
        this.isCoordinador = (rol === 'ROL_COORDINADOR');
        
        // Cargar foto de perfil
        this.cargarFotoPerfil();
      } else {
        this.userFullName = null;
        this.userProfileImage = null;
        this.userEmail = null;
        this.isAdmin = false;
        this.isCoordinador = false;
      }
    });
  }

  cargarFotoPerfil() {
    if (this.userEmail) {
      this.perfilService.getPerfilByEmail(this.userEmail).subscribe({
        next: (perfil) => {
          if (perfil.fotoPerfil) {
            this.userProfileImage = this.perfilService.getFotoUrl(perfil.fotoPerfil);
          }
        },
        error: (error) => {
          console.error('Error cargando foto de perfil:', error);
        }
      });
    }
  }

  onToggle(): void {
    this.toggleRequest.emit();
  }

  logout(): void {
    this.storageService.signOut();
    this.router.navigate(['/inicio']);
  }

  goToPerfil(): void {
    if (this.userEmail) {
      this.router.navigate(['/perfil', this.userEmail]);
    }
  }
}