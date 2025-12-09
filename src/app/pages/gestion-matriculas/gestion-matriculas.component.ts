import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { MatriculaService } from '../../services/matricula.service';
import { EstudianteService } from '../../services/estudiante.service';
import { SeccionService } from '../../services/seccion.service';
import { EstudianteDTO } from '../../dto/response/EstudianteDTO';
import { SeccionConHorariosDTO } from '../../dto/response/SeccionConHorarios';
import { MatriculaDTO } from '../../dto/response/MatriculaDTO';
import { CrearMatriculaRequest } from '../../dto/request/CrearMatriculaRequest';
import { CommonModule } from '@angular/common';
import { DetalleMatriculaDTO } from '../../dto/response/DetalleMatriculaDTO';

@Component({
  selector: 'app-gestion-matriculas',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './gestion-matriculas.component.html',
  styleUrls: ['./gestion-matriculas.component.css']
})

export class GestionMatriculasComponent implements OnInit, OnDestroy {
  // Búsqueda de estudiantes
  buscarEstudianteControl = new FormControl('');
  estudiantesEncontrados: EstudianteDTO[] = [];
  estudianteSeleccionado: EstudianteDTO | null = null;
  
  // Período académico
  periodoAcademicoActual = this.getPeriodoActual();
  
  // Secciones
  seccionesDisponibles: SeccionConHorariosDTO[] = [];
  seccionesSeleccionadas: SeccionConHorariosDTO[] = [];
  seccionesFiltradas: SeccionConHorariosDTO[] = [];
  
  // Matrículas existentes
  matriculas: MatriculaDTO[] = [];
  matriculasFiltradas: MatriculaDTO[] = [];
  
  // Filtros
  filtroEstudiante: string = '';
  filtroPeriodo: string = this.periodoAcademicoActual;
  filtroEstado: string = '';
  
  // Estado
  isLoading = false;
  hayConflictosHorario = false;
  mensajeError: string = '';
  mensajeExito: string = '';
  
  // Para destruir observables
  private destroy$ = new Subject<void>();
  
  constructor(
    private estudianteService: EstudianteService,
    private seccionService: SeccionService,
    private matriculaService: MatriculaService
  ) {}
  
  ngOnInit(): void {
    this.configurarBusquedaEstudiante();
    this.cargarMatriculas();
    this.cargarSeccionesDisponibles();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private configurarBusquedaEstudiante(): void {
    this.buscarEstudianteControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(termino => {
          if (!termino || termino.trim().length < 2) {
            this.estudiantesEncontrados = [];
            return [];
          }
          return this.estudianteService.busquedaRapida(termino);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (estudiantes) => {
          this.estudiantesEncontrados = estudiantes;
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.estudiantesEncontrados = [];
        }
      });
  }
  
  cargarMatriculas(): void {
    this.isLoading = true;
    this.matriculaService.obtenerTodas().subscribe({
      next: (matriculas) => {
        this.matriculas = matriculas;
        this.matriculasFiltradas = [...matriculas];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al cargar matrículas: ' + error.message);
        this.isLoading = false;
      }
    });
  }
  
  cargarSeccionesDisponibles(): void {
    this.isLoading = true;
    this.seccionService.obtenerSeccionesConHorarios().subscribe({
      next: (secciones) => {
        this.seccionesDisponibles = secciones;
        this.seccionesFiltradas = [...secciones];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al cargar secciones: ' + error.message);
        this.isLoading = false;
      }
    });
  }
  
  seleccionarEstudiante(estudiante: EstudianteDTO): void {

    if (estudiante.yaMatriculado && estudiante.periodoMatriculado === this.periodoAcademicoActual) {
      this.cargarMatriculaExistente(estudiante.id);
      return;
    }
    this.estudianteSeleccionado = estudiante;
    this.estudiantesEncontrados = [];
    
    // Mostrar nombre completo en el input
    this.buscarEstudianteControl.setValue(
      `${estudiante.codigoEstudiante} - ${estudiante.nombreCompleto}`,
      { emitEvent: false }
    );
    
    // Si ya está matriculado, mostrar advertencia
    if (estudiante.yaMatriculado) {
      this.mostrarError(`¡Atención! Este estudiante ya está matriculado en ${estudiante.periodoMatriculado}. 
                        Puede agregar cursos adicionales.`);
    }
    
    // Filtrar secciones disponibles para este estudiante
    this.filtrarSeccionesParaEstudiante(estudiante.id);
  }
  
  private cargarMatriculaExistente(estudianteId: string): void {
  this.isLoading = true;
  
  // Buscar matrícula activa del estudiante en el período actual
  this.matriculaService.obtenerMatriculasPorEstudiante(estudianteId).subscribe({
    next: (matriculas: any) => {
      const matriculaActual = matriculas.find((m: MatriculaDTO) => 
        m.periodoAcademico === this.periodoAcademicoActual && m.estado === 'ACTIVA'
      );
      
      if (matriculaActual) {
        this.mostrarModalEdicion(matriculaActual);
      }
      
      this.isLoading = false;
    },
    error: (error: any) => {
      this.mostrarError('Error al cargar matrícula existente');
      this.isLoading = false;
    }
  });
}

private mostrarModalEdicion(matricula: MatriculaDTO): void {
  // Aquí puedes implementar un modal para editar
  if (confirm(`Este estudiante ya tiene una matrícula ACTIVA en ${matricula.periodoAcademico}. 
              ¿Desea agregar cursos adicionales o ver los detalles?`)) {
    // Cargar datos para edición
    this.estudianteSeleccionado = {
      id: matricula.estudianteId,
      codigoEstudiante: matricula.estudianteCodigo,
      nombreCompleto: matricula.estudianteNombre,
      // ... otros campos
    } as EstudianteDTO;
    
    // Marcar secciones ya inscritas
  }
}


  private filtrarSeccionesParaEstudiante(estudianteId: string): void {
    this.isLoading = true;
    this.seccionService.obtenerSeccionesDisponiblesParaEstudiante(estudianteId).subscribe({
      next: (secciones) => {
        this.seccionesDisponibles = secciones;
        this.seccionesFiltradas = [...secciones];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.warn('No se pudieron filtrar secciones:', error);
        // Si falla, mantener todas las secciones
        this.isLoading = false;
      }
    });
  }
  
  toggleSeccion(seccion: SeccionConHorariosDTO): void {

      // Verificar si ya está seleccionada una sección del MISMO CURSO
      const mismoCursoYaSeleccionado = this.seccionesSeleccionadas.some(s => 
        s.cursoNombre === seccion.cursoNombre && s.id !== seccion.id
      );
      
      if (mismoCursoYaSeleccionado) {
        this.mostrarError(`Ya has seleccionado una sección del curso ${seccion.cursoNombre}`);
        return;
      }
    const index = this.seccionesSeleccionadas.findIndex(s => s.id === seccion.id);
    
    if (index === -1) {
      // Agregar si hay cupos
      if (seccion.cuposDisponibles > 0) {
        this.seccionesSeleccionadas.push(seccion);
        this.validarHorarios();
      } else {
        this.mostrarError('No hay cupos disponibles en esta sección');
      }
    } else {
      // Remover
      this.seccionesSeleccionadas.splice(index, 1);
      this.validarHorarios();
    }
  }
  
  private validarHorarios(): void {
    if (this.seccionesSeleccionadas.length < 2) {
      this.hayConflictosHorario = false;
      return;
    }
    
    // Validación de horarios en frontend
    const horarios: Array<{
      seccionId: string;
      seccionCodigo: string;
      dia: string;
      inicio: string;
      fin: string;
    }> = [];
    
    // Recolectar todos los horarios
    this.seccionesSeleccionadas.forEach(seccion => {
      seccion.horarios.forEach(horario => {
        horarios.push({
          seccionId: seccion.id,
          seccionCodigo: seccion.codigoSeccion,
          dia: horario.diaSemana,
          inicio: horario.horaInicio,
          fin: horario.horaFin
        });
      });
    });
    
    // Verificar conflictos
    for (let i = 0; i < horarios.length; i++) {
      for (let j = i + 1; j < horarios.length; j++) {
        if (this.haySolapamiento(horarios[i], horarios[j])) {
          this.hayConflictosHorario = true;
          this.mostrarError(
            `Conflicto de horario: ${horarios[i].seccionCodigo} (${horarios[i].dia} ${horarios[i].inicio}-${horarios[i].fin}) ` +
            `y ${horarios[j].seccionCodigo} (${horarios[j].dia} ${horarios[j].inicio}-${horarios[j].fin})`
          );
          return;
        }
      }
    }
    
    this.hayConflictosHorario = false;
  }
  
  private haySolapamiento(h1: any, h2: any): boolean {
    // Diferente día, no hay conflicto
    if (h1.dia !== h2.dia) return false;
    
    // Convertir a minutos para comparar
    const inicio1 = this.horaToMinutes(h1.inicio);
    const fin1 = this.horaToMinutes(h1.fin);
    const inicio2 = this.horaToMinutes(h2.inicio);
    const fin2 = this.horaToMinutes(h2.fin);
    
    // Verificar solapamiento
    return (inicio1 < fin2 && fin1 > inicio2);
  }
  
  private horaToMinutes(hora: string): number {
    if (!hora) return 0;
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + (minutos || 0);
  }
  
  crearMatricula(): void {
    // Validaciones
    if (!this.estudianteSeleccionado) {
      this.mostrarError('Seleccione un estudiante');
      return;
    }
    
    if (this.seccionesSeleccionadas.length === 0) {
      this.mostrarError('Seleccione al menos una sección');
      return;
    }
    
    if (this.hayConflictosHorario) {
      this.mostrarError('Resuelva los conflictos de horario antes de continuar');
      return;
    }
    
    // Validar que todas las secciones tengan cupo
    const sinCupo = this.seccionesSeleccionadas.filter(s => s.cuposDisponibles <= 0);
    if (sinCupo.length > 0) {
      this.mostrarError('Algunas secciones seleccionadas ya no tienen cupos disponibles');
      return;
    }
    
    this.isLoading = true;
    
    const request: CrearMatriculaRequest = {
      estudianteId: this.estudianteSeleccionado.id,
      periodoAcademico: this.periodoAcademicoActual,
      seccionesIds: this.seccionesSeleccionadas.map(s => s.id)
    };
    
    this.matriculaService.crearMatricula(request).subscribe({
      next: (matriculaCreada) => {
        this.matriculas.push(matriculaCreada);
        this.matriculasFiltradas = [...this.matriculas];
        
        this.mostrarExito(`Matrícula creada exitosamente para ${this.estudianteSeleccionado?.nombreCompleto}`);
        this.limpiarFormulario();
        this.isLoading = false;
      },
      error: (error: any) => {
        const mensajeError = error.error?.message || error.message || 'Error desconocido';
        this.mostrarError('Error al crear matrícula: ' + mensajeError);
        this.isLoading = false;
      }
    });
  }
  
  limpiarFormulario(): void {
    this.estudianteSeleccionado = null;
    this.buscarEstudianteControl.setValue('');
    this.seccionesSeleccionadas = [];
    this.estudiantesEncontrados = [];
    this.hayConflictosHorario = false;
    
    // Recargar secciones para actualizar cupos
    this.cargarSeccionesDisponibles();
  }
  
  // Filtros para la tabla de matrículas
  filtrarMatriculas(): void {
    let filtradas = [...this.matriculas];
    
    if (this.filtroEstudiante) {
      const termino = this.filtroEstudiante.toLowerCase();
      filtradas = filtradas.filter(m => 
        m.estudianteNombre.toLowerCase().includes(termino) ||
        m.estudianteCodigo.toLowerCase().includes(termino)
      );
    }
    
    if (this.filtroPeriodo) {
      filtradas = filtradas.filter(m => m.periodoAcademico === this.filtroPeriodo);
    }
    
    if (this.filtroEstado) {
      filtradas = filtradas.filter(m => m.estado === this.filtroEstado);
    }
    
    this.matriculasFiltradas = filtradas;
  }
  
  filtrarSecciones(): void {
    // Puedes implementar filtros para secciones si lo necesitas
    this.seccionesFiltradas = [...this.seccionesDisponibles];
  }
  
  // Métodos auxiliares
  getPeriodosAcademicos(): string[] {
    const periodos = new Set(this.matriculas.map(m => m.periodoAcademico));
    return Array.from(periodos).sort().reverse();
  }
  
  getCantidadCursos(matricula: MatriculaDTO): number {
    return matricula.detalles?.length || 0;
  }
  
  getTotalHoras(matricula: MatriculaDTO): number {
    // Puedes implementar cálculo real si tienes la información
    return matricula.detalles?.length * 2 || 0; // Ejemplo: 2 horas por curso
  }
  
  eliminarMatricula(matriculaId: string): void {
    if (confirm('¿Está seguro de eliminar esta matrícula? Se cambiará el estado a INACTIVA.')) {
      this.matriculaService.eliminar(matriculaId).subscribe({
        next: () => {
          const index = this.matriculas.findIndex(m => m.id === matriculaId);
          if (index !== -1) {
            this.matriculas[index].estado = 'INACTIVA';
            this.matriculasFiltradas = [...this.matriculas];
            this.mostrarExito('Matrícula eliminada exitosamente');
          }
        },
        error: (error: any) => {
          this.mostrarError('Error al eliminar matrícula: ' + error.message);
        }
      });
    }
  }
  
  agregarCursoAMatricula(matricula: MatriculaDTO): void {
    // Podrías implementar un modal para agregar cursos a matrícula existente
    alert('Funcionalidad para agregar cursos a matrícula existente (implementar)');
  }
  
  private getPeriodoActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const semester = now.getMonth() < 6 ? 'I' : 'II';
    return `${year}-${semester}`;
  }
  
  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => this.mensajeError = '', 5000);
  }
  
  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => this.mensajeExito = '', 5000);
  }

  isSeccionSeleccionada(seccion: SeccionConHorariosDTO): boolean {
    return this.seccionesSeleccionadas?.some(s => s.id === seccion.id);
  }

  puedeAgregar(seccion: SeccionConHorariosDTO): boolean {
    return !this.isSeccionSeleccionada(seccion);
  }

}