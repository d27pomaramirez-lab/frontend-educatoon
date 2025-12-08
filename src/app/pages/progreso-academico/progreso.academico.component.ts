import { Component, OnInit } from '@angular/core';
import { ProgresoResumenDTO } from '../../dto/response/ProgresoResumenDTO';
import { ProgresoAcademicoService } from '../../services/progreso-academico.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-progreso.academico.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progreso.academico.component.html',
  styleUrl: './progreso.academico.component.css',
})
export class ProgresoAcademicoComponent implements OnInit{
  progresoList: ProgresoResumenDTO[] = [];
  mensajeSinRegistros: string | null = null;
  errorMessage: string | null = null;
  isLoading = true;

  constructor(
    private progresoService: ProgresoAcademicoService,
    private storageService: StorageService,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.cargarProgreso();
  }

  cargarProgreso(): void {
    const usuario = this.storageService.getUser();
    //console.log('Usuario recuperado del storage:', usuario);

    if (!usuario || !usuario.email) {
      this.errorMessage = 'No se pudo identificar al estudiante (Falta Email).';
      this.isLoading = false;
      return;
    }

    // 1. Buscar el perfil por email para obtener el DNI
    this.perfilService.getPerfilByEmail(usuario.email).subscribe({
      next: (perfil: any) => {
        // 2. Verificar si tenemos el DNI
        if (perfil.dni) {
          this.consultarProgresoPorDni(perfil.dni);
        } else {
          this.errorMessage = 'El perfil del estudiante no tiene un DNI asociado.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.errorMessage = 'Error al obtener los datos del estudiante.';
        this.isLoading = false;
      }
    });
  }

  // Método auxiliar para hacer la petición final usando el DNI
  private consultarProgresoPorDni(dni: string): void {
    this.progresoService.consultarProgreso(dni).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.progresoList = response;
          this.mensajeSinRegistros = null;
        } else if (response && 'mensaje' in response) {
          this.progresoList = [];
          this.mensajeSinRegistros = (response as any).mensaje;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar progreso:', err);
        this.errorMessage = 'Ocurrió un error al cargar el progreso académico.';
        this.isLoading = false;
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'aprobado': return 'badge-success';
      case 'en riesgo': return 'badge-warning';
      case 'desaprobado': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  
}
