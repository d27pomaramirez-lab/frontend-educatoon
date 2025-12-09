import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../../services/curso.service';
import { CursoResponse } from '../../../dto/response/CursoResponse';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mis-cursos-docente',
    templateUrl: './mis-cursos-docente.component.html',
    styleUrls: ['./mis-cursos-docente.component.css'],
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class MisCursosDocenteComponent implements OnInit {

    cursos: CursoResponse[] = [];
    isLoading = true;
    errorMessage: string | null = null;

    constructor(
        private cursoService: CursoService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cargarMisCursos();
    }

    cargarMisCursos(): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.cursoService.listarMisCursosDocente().subscribe({
            next: (data) => {
                this.cursos = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Error al cargar los cursos asignados.';
                this.isLoading = false;
                console.error('Error cargando cursos', error);
            }
        });
    }

    // Navegación al CUS 08.1 (Paso 4 del Flujo Principal)
    navegarCrearMaterial(cursoId: string): void {
        // cursoId es el UUID del curso
        this.router.navigate(['/docente/cursos', cursoId, 'crear-material']);
    }
}