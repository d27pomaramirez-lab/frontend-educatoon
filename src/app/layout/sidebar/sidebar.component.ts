// en src/app/layout/sidebar/sidebar.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

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
  userEmail: string | null = null;
  isAdmin = false;
  isCoordinador = false;

  constructor(
    private storageService: StorageService,
    private router: Router,
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

  // Esta función es llamada por el botón de hamburguesa
  onToggle(): void {
    this.toggleRequest.emit();
  }

  logout(): void {
    this.storageService.signOut();
    this.router.navigate(['/inicio']);
  }

}
