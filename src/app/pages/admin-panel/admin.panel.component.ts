// en src/app/pages/admin-panel/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin.panel.component.html',
  styleUrl: './admin.panel.component.css'
})
export class AdminPanelComponent implements OnInit{

  usuariosPendientes: UsuarioPendienteResponse[] = [];
  tableErrorMessage: string | null = null;
  tableSuccessMessage: string | null = null;

  constructor(private usuarioService: UsuarioService) {

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
      },
      error: (err) => {
        this.tableErrorMessage = 'Error al cargar usuarios pendientes.';
        console.error(err);
      }
    });
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