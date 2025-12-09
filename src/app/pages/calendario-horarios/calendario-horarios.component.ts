import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../../services/horario.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-calendario-horarios.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario-horarios.component.html',
  styleUrl: './calendario-horarios.component.css',
})

export class CalendarioHorariosComponent implements OnInit {
  horarios: HorarioUsuario[] = [];
  horariosAgrupados: Map<string, HorarioUsuario[]> = new Map();
  
  // Días de la semana
  diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  
  // Horas del día
  horasDia = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];
  
  isLoading = false;
  usuarioActual: any;
  tipoVista: 'calendario' | 'lista' = 'calendario';
  
  constructor(
    private horarioService: HorarioService,
    private authService: StorageService
  ) {}
  
  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarHorarios();
  }
  
  private cargarUsuario(): void {
    this.usuarioActual = this.authService.getUser;
  }
  
  cargarHorarios(): void {
    this.isLoading = true;
    
    this.horarioService.getMiHorario().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
        this.agruparHorariosPorDia();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar horarios:', error);
        this.isLoading = false;
      }
    });
  }
  
  private agruparHorariosPorDia(): void {
    this.horariosAgrupados.clear();
    
    this.diasSemana.forEach(dia => {
      const horariosDelDia = this.horarios.filter(h => h.diaSemana === dia);
      this.horariosAgrupados.set(dia, horariosDelDia);
    });
  }
  // En calendario-horarios.component.ts - CORREGIDO
calcularEstiloHorario(horario: HorarioUsuario): any {
  const inicio = this.horaToMinutes(horario.horaInicio);
  const fin = this.horaToMinutes(horario.horaFin);
  const duracion = fin - inicio;
  
  // 7:00 AM es la hora base (420 minutos)
  const horaBase = 7 * 60; // 7:00 AM = 420 minutos
  
  // Si el horario empieza después de las 7:00 AM
  const top = (inicio - horaBase) * (60 / 60); // 60px por hora
  
  // Altura proporcional a la duración
  const height = duracion * (60 / 60);
  
  return {
    'top.px': top,
    'height.px': height,
    'background-color': horario.color || '#007bff',
    'border-left': `4px solid ${this.oscurecerColor(horario.color)}`,
    'left': '1px', // Margen izquierdo
    'right': '1px' // Margen derecho
  };
}

// También corregir el método tieneHorario():
tieneHorario(dia: string, horaIndex: number): HorarioUsuario | null {
  const horaInicio = this.horasDia[horaIndex];
  const horaInicioMinutos = this.horaToMinutes(horaInicio);
  const horaFinMinutos = horaInicioMinutos + 60; // Cada celda es 1 hora
  
  const horariosDia = this.horariosAgrupados.get(dia) || [];
  
  return horariosDia.find(horario => {
    const inicio = this.horaToMinutes(horario.horaInicio);
    const fin = this.horaToMinutes(horario.horaFin);
    
    // Verificar si el horario se solapa con esta celda
    return (inicio < horaFinMinutos && fin > horaInicioMinutos);
  }) || null;
}
  
  private horaToMinutes(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + (m || 0);
  }
  
  private oscurecerColor(color: string): string {
    // Simple función para oscurecer color
    return color.replace(')', ', 0.8)').replace('rgb', 'rgba');
  }
  
  // Verificar si hay horario en una celda específica
// En calendario-horarios.component.ts
getHorariosEnHora(dia: string, hora: string): HorarioUsuario[] {
  const horariosDia = this.horariosAgrupados.get(dia) || [];
  const horaInicioMinutos = this.horaToMinutes(hora);
  const horaFinMinutos = horaInicioMinutos + 60; // 1 hora de celda
  
  return horariosDia.filter(horario => {
    const inicio = this.horaToMinutes(horario.horaInicio);
    const fin = this.horaToMinutes(horario.horaFin);
    
    // Horario que se solapa con esta celda
    return (inicio < horaFinMinutos && fin > horaInicioMinutos);
  });
}

getTooltipHorario(horario: HorarioUsuario): string {
  return `${horario.cursoNombre}\n` +
         `Sección: ${horario.seccionCodigo}\n` +
         `Aula: ${horario.aula}\n` +
         `Horario: ${horario.diaSemana} ${horario.horaInicio}-${horario.horaFin}\n` +
         `Duración: ${this.getDuracion(horario)}`;
}
  
  cambiarVista(tipo: 'calendario' | 'lista'): void {
    this.tipoVista = tipo;
  }
  
  getFormatoHora(hora: string): string {
    return hora.substring(0, 5);
  }
  
  getDuracion(horario: HorarioUsuario): string {
    const inicio = this.horaToMinutes(horario.horaInicio);
    const fin = this.horaToMinutes(horario.horaFin);
    const duracion = fin - inicio;
    
    if (duracion >= 60) {
      return `${duracion / 60} hora${duracion > 60 ? 's' : ''}`;
    }
    return `${duracion} minutos`;
  }
}