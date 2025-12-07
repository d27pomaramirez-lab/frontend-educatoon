// en src/app/pages/admin-panel/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../../utils/pagination.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule, PaginationComponent
  ],
  templateUrl: './admin.panel.component.html',
  styleUrl: './admin.panel.component.css'
})
export class AdminPanelComponent implements OnInit{

  usuariosPendientes: UsuarioPendienteResponse[] = [];
  tableErrorMessage: string | null = null;
  tableSuccessMessage: string | null = null;

  // Variables de Paginación
    paginaActual: number = 1;
    elementosPorPagina: number = 10;
    totalPaginas: number = 0;
    usuariosPaginados: UsuarioPendienteResponse[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private paginationService: PaginationService
  ) {

  }

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes(): void {
    this.tableErrorMessage = null;
    this.tableSuccessMessage = null;
    this.usuarioService.getUsuariosPendientes().subscribe({
      next: (data) => {
        this.usuariosPendientes = data;
        this.aplicarPaginacion(this.paginaActual);
      },
      error: (err) => {
        this.tableErrorMessage = 'Error al cargar usuarios pendientes.';
        console.error(err);
      }
    });
  }

  aplicarPaginacion(pagina: number): void {
    const { data, totalPages } = this.paginationService.getPaginatedData(
      this.usuariosPendientes,
      pagina,
      this.elementosPorPagina
    );
    this.usuariosPaginados = data;
    this.totalPaginas = totalPages;
    this.paginaActual = pagina;
  }

  onAprobar(id: string): void {
    this.tableSuccessMessage = null;
    this.usuarioService.aprobarUsuario(id).subscribe({
      next: (response) => {
        this.tableSuccessMessage = response;
        this.cargarPendientes(); 
      },
      error: (err) => {
        this.tableErrorMessage = err.error || 'Error al aprobar el usuario.';
        console.error(err);
      }
    });
  }


}