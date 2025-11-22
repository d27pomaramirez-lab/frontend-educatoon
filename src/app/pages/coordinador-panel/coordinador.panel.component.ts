import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService} from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';

@Component({
  selector: 'app-coordinador-panel',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './coordinador.panel.component.html',
  styleUrl: './coordinador.panel.component.css',
})
export class CoordinadorPanelComponent {
    usuariosPendientes: UsuarioPendienteResponse[] = [];
    errorMessage: string | null = null;
    successMessage: string | null = null;

    constructor(private usuarioService: UsuarioService) {}

    ngOnInit(): void {
      this.cargarPendientes();
    }

    cargarPendientes(): void {
      this.errorMessage = null;
      this.usuarioService.getUsuariosPendientesParaCoordinador().subscribe({
        next: (data) => {
          this.usuariosPendientes = data;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar usuarios pendientes.';
          console.error(err);
        }
      });
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
