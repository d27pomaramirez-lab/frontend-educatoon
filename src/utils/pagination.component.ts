import { Component, Input, Output, EventEmitter, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container">
        <button 
            (click)="irAPagina.emit(paginaActual - 1)" 
            [disabled]="paginaActual === 1" 
            class="btn-pagination">
            Anterior
        </button>

        @for (pagina of paginas; track pagina) {
          <button 
              (click)="irAPagina.emit(pagina)" 
              [class.active]="pagina === paginaActual"
              class="btn-pagination btn-page-number">
              {{ pagina }}
          </button>
        }

        <button 
            (click)="irAPagina.emit(paginaActual + 1)" 
            [disabled]="paginaActual === totalPaginas || totalPaginas === 0" 
            class="btn-pagination">
            Siguiente
        </button>
    </div>
  `,
  styles: [`
    /* Estilos del CSS original para la paginación */
    .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
        gap: 0.5rem;
    }
    .btn-pagination {
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        background-color: #f4f4f4;
        cursor: pointer;
        border-radius: 5px;
        font-size: 0.9rem;
        transition: background-color 0.2s;
    }
    .btn-pagination:hover:not([disabled]) {
        background-color: #e0e0e0;
    }
    .btn-pagination[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .btn-page-number.active {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
        font-weight: bold;
    }
  `]
})
export class PaginationComponent {
    // Inputs del estado de la paginación
    @Input() totalPaginas: number = 0;
    @Input() paginaActual: number = 1;
    
    // Output para notificar al componente padre que se cambie de página
    @Output() irAPagina = new EventEmitter<number>();

    // Genera un array de números de página
    get paginas(): number[] {
      return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    }
}