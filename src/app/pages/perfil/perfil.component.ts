import { Component, Input, OnInit } from '@angular/core';
import { PerfilResponse } from '../../dto/response/PerfilResponse';
import { PerfilService } from '../../services/perfil.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PerfilUpdateDTO } from '../../dto/request/PerrfilUpdateDTO';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-perfil.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  perfil!: PerfilResponse;
  userEmail!: string;
  fotoUrl?: string;
  isLoading = true;
  isEditing = false;
  perfilEditado: PerfilUpdateDTO = {};

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
        else {
          this.fotoUrl = 'assets/images/default-avatar.png';
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
    if (this.isEditing) {
      // Copiar datos actuales al formulario de edición
      this.perfilEditado = {
        telefono: this.perfil.telefono,
        sexo: this.perfil.sexo,
        estadoCivil: this.perfil.estadoCivil,
        fechaNacimiento: this.perfil.fechaNacimiento,
        carreraPostular: this.perfil.carreraPostular,
        universidadPostular: this.perfil.universidadPostular,
        colegioProcedencia: this.perfil.colegioProcedencia,
        especialidad: this.perfil.especialidad
      };
    }
  }

  guardarCambios() {
    this.perfilService.actualizarPerfil(this.userEmail, this.perfilEditado).subscribe({
      next: (perfilActualizado) => {
        this.perfil = perfilActualizado;
        this.isEditing = false;
        alert('Perfil actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error actualizando perfil:', error);
        alert('Error al actualizar el perfil');
      }
    });
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.perfilEditado = {};
  }
}