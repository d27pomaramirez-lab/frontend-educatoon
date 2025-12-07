import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuarioService} from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { PaginationComponent } from '../../../utils/pagination.component';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-coordinador-panel',
  standalone: true,
  imports: [
    CommonModule, PaginationComponent
  ],
  templateUrl: './coordinador.panel.component.html',
  styleUrl: './coordinador.panel.component.css',
})
export class CoordinadorPanelComponent {
    usuariosPendientes: UsuarioPendienteResponse[] = [];
    errorMessage: string | null = null;
    successMessage: string | null = null;

    // Variables de Paginación
      paginaActual: number = 1;
      elementosPorPagina: number = 10;
      totalPaginas: number = 0;
      usuariosPaginadas: UsuarioPendienteResponse[] = [];

    constructor(
      private usuarioService: UsuarioService,
      private paginationService: PaginationService
    ) {}
    
    ngOnInit(): void {
      this.cargarPendientes();
    }

    cargarPendientes(): void {
      this.errorMessage = null;
      this.usuarioService.getUsuariosPendientesParaCoordinador().subscribe({
        next: (data) => {
          this.usuariosPendientes = data;
          this.aplicarPaginacion(this.paginaActual);
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar usuarios pendientes.';
          console.error(err);
        }
      });
    }

     // Método unificado para aplicar y actualizar la paginación
  aplicarPaginacion(pagina: number): void {
    const { data, totalPages } = this.paginationService.getPaginatedData(
      this.usuariosPendientes,
      pagina,
      this.elementosPorPagina
    );
    this.usuariosPaginadas = data;
    this.totalPaginas = totalPages;
    this.paginaActual = pagina;
  }

    onValidar(id: string): void {
      this.successMessage = null;
      this.usuarioService.validarDocumentos(id).subscribe({
        next: (response) => {
          this.successMessage = response;

          const usuario = this.usuariosPendientes.find(u => u.id === id);
          if (usuario) {
            usuario.documentosValidados = true;
          }
        },
        error: (err) => {
          this.errorMessage = 'Error al validar los documentos.';
          console.error(err);
        }
      });
    }
}
