import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioPendienteResponse } from '../../dto/response/UsuarioPendienteResponse';
import { AsesoriaResponse } from '../../dto/response/AsesoriaResponse';
import { AsesoriaService } from '../../services/asesoria.service';
import { CrearAsesoriaRequest } from '../../dto/request/CrearAsesoriaRequest';

@Component({
  selector: 'app-gestion-asesorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion.asesorias.component.html',
  styleUrl: './gestion.asesorias.component.css',
})
export class GestionAsesoriasComponent implements OnInit {
    asesoriaForm: FormGroup;
    formErrorMessage: string | null = null;
    formSuccessMessage: string | null = null;

    listaEstudiantes: UsuarioPendienteResponse[] = [];
    listaDocentes: UsuarioPendienteResponse[] = [];
    listaCursos: any[] = [];

    listaAsesorias: AsesoriaResponse[] = [];
    tableErrorMessage: string | null = null;

    constructor(
      private asesoriaService: AsesoriaService,
      private usuarioService: UsuarioService
    ) {
      this.asesoriaForm = new FormGroup({
        estudianteId: new FormControl('', [Validators.required]),
        docenteId: new FormControl('', [Validators.required]),
        cursoId: new FormControl('', [Validators.required]),
        
        fecha: new FormControl('', [Validators.required]),
        hora: new FormControl('', [Validators.required]),
        duracionMinutos: new FormControl(60, [Validators.required, Validators.min(30)]),
        
        modalidad: new FormControl('VIRTUAL', [Validators.required]),
        enlaceReunion: new FormControl(''),
        lugarPresencial: new FormControl(''),
        
        tema: new FormControl('', [Validators.required]),
        areasRefuerzo: new FormControl('')
      });
    }

    ngOnInit(): void {
      this.cargarUsuariosParaCombos();
      this.cargarAsesorias();
      
      this.listaCursos = [
        { id: 'a421024d-b9ab-46ab-80e6-fecb301abceb', nombre: 'Algebra' }
      ];
    }

    cargarUsuariosParaCombos(): void {
      this.usuarioService.getUsuariosParaCoordinador().subscribe({
        next: (usuarios) => {
          this.listaEstudiantes = usuarios.filter(u => u.rolNombre === 'ROL_ESTUDIANTE' && u.enabled);
          this.listaDocentes = usuarios.filter(u => u.rolNombre === 'ROL_DOCENTE' && u.enabled);
          //console.log('Todos los usuarios:', usuarios);
          //console.log('Estudiantes filtrados:', this.listaEstudiantes);
        },
        error: (err) => console.error('Error cargando usuarios', err)
      });
    }

    cargarAsesorias(): void {
      this.asesoriaService.listarAsesorias().subscribe({
        next: (data) => this.listaAsesorias = data,
        error: (err) => this.tableErrorMessage = 'Error al cargar la lista de asesorías.'
      });
    }

    onSubmit(): void {
      this.formErrorMessage = null;
      this.formSuccessMessage = null;

      if (this.asesoriaForm.valid) {
        const fechaInput = this.asesoriaForm.get('fecha')?.value;
        const horaInput = this.asesoriaForm.get('hora')?.value;
        const fechaCompletaISO = `${fechaInput}T${horaInput}:00`;

        const request: CrearAsesoriaRequest = {
          ...this.asesoriaForm.value,
          fecha: fechaCompletaISO
        };

        this.asesoriaService.crearAsesoria(request).subscribe({
          next: (resp) => {
            this.formSuccessMessage = resp;
            this.asesoriaForm.reset({ 
              modalidad: 'VIRTUAL', 
              duracionMinutos: 60 
            });
            this.cargarAsesorias();
          },
          error: (err) => {
            this.formErrorMessage = err.error || 'Error al programar la asesoría.';
          }
        });
      }
    }
    
    onModalidadChange(): void {
      const modalidad = this.asesoriaForm.get('modalidad')?.value;
      const enlaceControl = this.asesoriaForm.get('enlaceReunion');
      const lugarControl = this.asesoriaForm.get('lugarPresencial');

      if (modalidad === 'VIRTUAL') {
        enlaceControl?.setValidators([Validators.required]);
        lugarControl?.clearValidators();
      } else {
        lugarControl?.setValidators([Validators.required]);
        enlaceControl?.clearValidators();
      }
      enlaceControl?.updateValueAndValidity();
      lugarControl?.updateValueAndValidity();
    }
}
