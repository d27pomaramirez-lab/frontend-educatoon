import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PruebaEntradaService } from '../../services/prueba-entrada.service';
import { EstudianteService } from '../../services/estudiante.service';
import { CrearPruebaRequest } from '../../dto/request/CrearPruebaRequest';
import { EstudianteDTO } from '../../dto/response/EstudianteDTO';
import { PruebaEntradaDTO } from '../../dto/response/PruebaEntradaDTO';
import { ResultadoAsignacionDTO } from '../../dto/response/ResultadoAsignacionDTO';

@Component({
  selector: 'app-registro-pruebas.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-pruebas.component.html',
  styleUrl: './registro-pruebas.component.css',
})


export class RegistroPruebasComponent implements OnInit {
  estudiantes: EstudianteDTO[] = [];
  pruebas: PruebaEntradaDTO[] = [];
  
  // Formulario de nueva prueba
  pruebaNueva: CrearPruebaRequest = {
    estudianteId: '',
    perfilAprendizaje: '',
    puntajeTotal: undefined,
    fechaRendicion: new Date()
  };
  
  // Resultado de asignación
  resultadoAsignacion?: ResultadoAsignacionDTO;
  
  // Estadísticas
  totalPruebas: number = 0;
  asignacionesExitosas: number = 0;
  
  // Estados
  procesando: boolean = false;
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private pruebaEntradaService: PruebaEntradaService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.cargarPruebas();
  }

  cargarEstudiantes(): void {
    this.estudianteService.obtenerTodos().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
      },
      error: (error) => {
        this.mostrarError('Error al cargar estudiantes: ' + error.message);
      }
    });
  }

  cargarPruebas(): void {
    this.pruebaEntradaService.obtenerPruebasPorEstado('EVALUADO').subscribe({
      next: (pruebas) => {
        this.pruebas = pruebas;
        this.calcularEstadisticas();
      },
      error: (error) => {
        this.mostrarError('Error al cargar pruebas: ' + error.message);
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalPruebas = this.pruebas.length;
    
    // Cargar asignaciones exitosas
    this.pruebaEntradaService.obtenerAsignacionesPorEstado('MATRICULADO').subscribe({
      next: (asignaciones) => {
        this.asignacionesExitosas = asignaciones.length;
      },
      error: (error) => {
        console.error('Error al cargar asignaciones:', error);
      }
    });
  }

  registrarPrueba(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.procesando = true;
    this.resultadoAsignacion = undefined;
    
    this.pruebaEntradaService.registrarPrueba(this.pruebaNueva).subscribe({
      next: (pruebaCreada) => {
        // Mostrar resultado (la asignación se hizo automáticamente en el backend)
        this.resultadoAsignacion = {
          estudianteId: pruebaCreada.estudianteId,
          estudianteNombre: pruebaCreada.estudianteNombre,
          perfilAprendizaje: pruebaCreada.perfilAprendizaje,
          exitoso: true,
          mensaje: 'Prueba registrada y asignación automática completada'
        };
        
        this.pruebas.unshift(pruebaCreada);
        this.calcularEstadisticas();
        this.limpiarFormulario();
        
        this.mostrarExito('Prueba registrada exitosamente');
        this.procesando = false;
      },
      error: (error) => {
        this.resultadoAsignacion = {
          estudianteId: this.pruebaNueva.estudianteId,
          estudianteNombre: this.obtenerNombreEstudiante(this.pruebaNueva.estudianteId),
          perfilAprendizaje: this.pruebaNueva.perfilAprendizaje,
          exitoso: false,
          mensaje: 'Error: ' + error.message
        };
        
        this.mostrarError('Error al registrar prueba: ' + error.message);
        this.procesando = false;
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.pruebaNueva.estudianteId) {
      this.mostrarError('Seleccione un estudiante');
      return false;
    }
    
    if (!this.pruebaNueva.perfilAprendizaje) {
      this.mostrarError('Seleccione un perfil de aprendizaje');
      return false;
    }
    
    if (this.pruebaNueva.puntajeTotal !== undefined && 
        (this.pruebaNueva.puntajeTotal < 0 || this.pruebaNueva.puntajeTotal > 100)) {
      this.mostrarError('El puntaje debe estar entre 0 y 100');
      return false;
    }
    
    return true;
  }

  limpiarFormulario(): void {
    this.pruebaNueva = {
      estudianteId: '',
      perfilAprendizaje: '',
      puntajeTotal: undefined,
      fechaRendicion: new Date()
    };
  }

  obtenerNombreEstudiante(id: string): string {
    const estudiante = this.estudiantes.find(e => e.id === id);
    return estudiante ? estudiante.nombreCompleto : 'Desconocido';
  }

  obtenerPerfilesAprendizaje() {
    return [
      { value: 'VISUAL', label: 'Visual' },
      { value: 'AUDITIVO', label: 'Auditivo' },
      { value: 'KINESTÉSICO', label: 'Kinestésico' },
      { value: 'MIXTO', label: 'Mixto' }
    ];
  }

  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => this.mensajeError = '', 5000);
  }

  mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => this.mensajeExito = '', 5000);
  }
}