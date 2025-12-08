import { Component, OnInit } from '@angular/core';
import { ProgresoResumenDTO } from '../../dto/response/ProgresoResumenDTO';
import { ProgresoAcademicoService } from '../../services/progreso-academico.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

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
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.cargarProgreso();
  }

  cargarProgreso(): void {
    // 1. Obtener el usuario actual desde el StorageService
    const usuario = this.storageService.getUser();
    
    if (!usuario || !usuario.id) {
      this.errorMessage = 'No se pudo identificar al estudiante.';
      this.isLoading = false;
      return;
    }

    // 2. Llamar al servicio
    this.progresoService.consultarProgreso(usuario.id).subscribe({
      next: (response) => {
        // 3. Manejar la respuesta (puede ser array o objeto con mensaje)
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

  // Helper para clases CSS según el estado
  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'aprobado': return 'badge-success';
      case 'en riesgo': return 'badge-warning';
      case 'desaprobado': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  
}
