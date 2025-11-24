import { Component, Input, OnInit } from '@angular/core';
import { PerfilResponse } from '../../dto/response/PerfilResponse';
import { PerfilService } from '../../services/perfil.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-perfil.component',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  perfil!: PerfilResponse;
  userEmail!: string;
  fotoUrl?: string;
  isLoading = true;
  isEditing = false;

  constructor(private route: ActivatedRoute,
    private perfilService: PerfilService) {}

  ngOnInit() {
    this.userEmail = this.route.snapshot.paramMap.get('id')!;
    this.cargarPerfil();  
  }

  cargarPerfil() {
    this.isLoading = true;
    this.perfilService.getPerfilByEmail(this.userEmail).subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        if (perfil.fotoPerfil) {
          this.fotoUrl = this.perfilService.getFotoUrl(perfil.fotoPerfil);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        this.isLoading = false;
      }
    });
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.perfilService.subirFotoByEmail(this.userEmail, file).subscribe({
        next: (nombreArchivo) => {
          this.fotoUrl = this.perfilService.getFotoUrl(nombreArchivo);
          this.cargarPerfil(); // Recargar datos actualizados
        },
        error: (error) => {
          console.error('Error subiendo foto:', error);
          alert('Error al subir la foto');
        }
      });
    }
  }

  eliminarFoto() {
    if (confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
      this.perfilService.eliminarFotoByEmail(this.userEmail).subscribe({
        next: () => {
          this.fotoUrl = "";
          this.cargarPerfil();
        },
        error: (error) => {
          console.error('Error eliminando foto:', error);
          alert('Error al eliminar la foto');
        }
      });
    }
  }

    toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  guardarCambios() {
    // Aquí puedes implementar la actualización de datos del perfil
    console.log('Guardar cambios:', this.perfil);
    this.isEditing = false;
  }
}