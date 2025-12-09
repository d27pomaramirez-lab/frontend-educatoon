import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HorarioService } from '../../services/horario.service';
import { SeccionService } from '../../services/seccion.service';
import { SeccionResponse } from '../../dto/response/SeccionResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crud-horarios',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './crud-horarios.component.html',
  styleUrls: ['./crud-horarios.component.css']
})
export class CrudHorariosComponent implements OnInit {
  horarioForm: FormGroup;
  horarios: Horario[] = [];
  secciones: SeccionResponse[] = [];
  horariosFiltrados: Horario[] = [];
  
  isEditing = false;
  isLoading = false;
  selectedHorario: Horario | null = null;
  
  filtroSeccion: string = '';
  filtroDia: string = '';
  
  diasSemana = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIÉRCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' },
    { value: 'SÁBADO', label: 'Sábado' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private horarioCrudService: HorarioService,
    private seccionService: SeccionService
  ) {
    this.horarioForm = this.fb.group({
      seccionId: ['', Validators.required],
      diaSemana: ['', Validators.required],
      horaInicio: ['08:00', Validators.required],
      horaFin: ['10:00', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.cargarSecciones();
    this.cargarHorarios();
  }
  
  cargarSecciones(): void {
    this.isLoading = true;
    this.seccionService.listarSecciones().subscribe({
      next: (secciones) => {
        this.secciones = secciones.map(s => ({
          id: s.id,
          codigoSeccion: s.codigoSeccion,
          curso: s.curso || 'Sin curso',
          capacidad: s.capacidad || 0,
          aula: s.aula || 'No asignada',
          docente: s.docente || 'No asignado'
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar secciones:', error);
        this.isLoading = false;
      }
    });
  }
  
  cargarHorarios(): void {
    this.isLoading = true;
    // Cargar horarios de todas las secciones
    const promesas = this.secciones.map(seccion => 
      this.horarioCrudService.getHorariosPorSeccion(seccion.id).toPromise()
    );
    
    Promise.all(promesas).then(results => {
      this.horarios = results.flat().filter(Boolean);
      this.horariosFiltrados = [...this.horarios];
      this.isLoading = false;
    }).catch(error => {
      console.error('Error al cargar horarios:', error);
      this.isLoading = false;
    });
  }
  
  onSubmit(): void {
    if (this.horarioForm.invalid) return;
    
    this.isLoading = true;
    const formValue = this.horarioForm.value;
    
    if (this.isEditing && this.selectedHorario) {
      this.horarioCrudService.actualizarHorario(this.selectedHorario.id, formValue).subscribe({
        next: (horario) => {
          this.mostrarExito('Horario actualizado exitosamente');
          this.limpiarFormulario();
          this.cargarHorarios();
        },
        error: (error) => {
          this.mostrarError('Error: ' + (error.error?.message || error.message));
          this.isLoading = false;
        }
      });
    } else {
      this.horarioCrudService.crearHorario(formValue).subscribe({
        next: (horario) => {
          this.mostrarExito('Horario creado exitosamente');
          this.limpiarFormulario();
          this.cargarHorarios();
        },
        error: (error) => {
          this.mostrarError('Error: ' + (error.error?.message || error.message));
          this.isLoading = false;
        }
      });
    }
  }
  
  editarHorario(horario: Horario): void {
    this.selectedHorario = horario;
    this.isEditing = true;
    
    this.horarioForm.patchValue({
      seccionId: horario.seccionId,
      diaSemana: horario.diaSemana,
      horaInicio: this.ajustarFormatoHora(horario.horaInicio),
      horaFin: this.ajustarFormatoHora(horario.horaFin)
    });
  }
  
  eliminarHorario(id: string): void {
    if (confirm('¿Está seguro de eliminar este horario?')) {
      this.horarioCrudService.eliminarHorario(id).subscribe({
        next: () => {
          this.mostrarExito('Horario eliminado exitosamente');
          this.cargarHorarios();
        },
        error: (error) => {
          this.mostrarError('Error al eliminar horario: ' + error.message);
        }
      });
    }
  }
  
  limpiarFormulario(): void {
    this.horarioForm.reset({
      horaInicio: '08:00',
      horaFin: '10:00'
    });
    this.isEditing = false;
    this.selectedHorario = null;
    this.isLoading = false;
  }
  
  filtrarHorarios(): void {
    let filtrados = [...this.horarios];
    
    if (this.filtroSeccion) {
      filtrados = filtrados.filter(h => 
        h.seccionCodigo.toLowerCase().includes(this.filtroSeccion.toLowerCase())
      );
    }
    
    if (this.filtroDia) {
      filtrados = filtrados.filter(h => h.diaSemana === this.filtroDia);
    }
    
    this.horariosFiltrados = filtrados;
  }
  
  // Métodos auxiliares
  getFormatoHora(hora: string): string {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  }
  
  ajustarFormatoHora(hora: string): string {
    if (!hora) return '08:00';
    // Asegurar formato HH:mm
    const [h, m] = hora.split(':');
    return `${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
  }
  
  calcularDuracion(inicio: string, fin: string): string {
    const inicioMin = this.horaToMinutes(inicio);
    const finMin = this.horaToMinutes(fin);
    const duracion = finMin - inicioMin;
    
    if (duracion >= 60) {
      const horas = Math.floor(duracion / 60);
      const minutos = duracion % 60;
      
      if (minutos === 0) {
        return `${horas} hora${horas > 1 ? 's' : ''}`;
      }
      return `${horas}h ${minutos}m`;
    }
    
    return `${duracion} minutos`;
  }
  
  private horaToMinutes(hora: string): number {
    if (!hora) return 0;
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + (m || 0);
  }
  
  private mostrarError(mensaje: string): void {
    alert('Error: ' + mensaje);
  }
  
  private mostrarExito(mensaje: string): void {
    alert(mensaje);
  }
}