import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../../../services/material.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-crear-material',
    templateUrl: './crear-material.component.html',
    styleUrls: ['./crear-material.component.css'],
    standalone: true, // Si es un componente standalone
    imports: [CommonModule, ReactiveFormsModule] // Añadir estos módulos
})
export class CrearMaterialComponent implements OnInit {
    materialForm: FormGroup;
    // *** CORRECCIÓN: cursoId ahora es string para contener el UUID ***
    cursoId: string;
    selectedFile: File | null = null;
    isLoading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private materialService: MaterialService
    ) {
        this.materialForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            archivo: [null, Validators.required]
        });

        // Obtener el ID del curso de la URL (Paso 3 del CUS)
        // *** CORRECCIÓN: SIN el operador '+' para mantenerlo como string (UUID) ***
        this.cursoId = this.route.snapshot.paramMap.get('cursoId')!;
    }

    ngOnInit(): void {
    }

    // Captura el objeto File
    onFileSelected(event: any): void {
        if (event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
            this.materialForm.patchValue({
                archivo: this.selectedFile
            });
            this.materialForm.get('archivo')?.updateValueAndValidity();
        }
    }

    onSubmit(): void {
        this.successMessage = null;
        this.errorMessage = null;

        if (this.materialForm.invalid || !this.selectedFile) {
            this.errorMessage = 'Por favor, complete todos los campos y seleccione un archivo.';
            return;
        }

        // Paso 5: El docente ingresa la información.
        this.isLoading = true;

        const { nombre, descripcion } = this.materialForm.value;

        this.materialService.subirMaterial(this.cursoId, nombre, descripcion, this.selectedFile)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe({
                next: (response) => {
                    // Paso 8: Muestra mensaje de confirmación exitosa
                    this.successMessage = response;
                    this.materialForm.reset();
                    this.selectedFile = null;
                    // Resetea el control de archivo en el HTML
                    const fileInput = document.getElementById('archivo') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                },
                error: (error) => {
                    // Manejo del Flujo Alternativo 1 (Tamaño superado)
                    this.errorMessage = error.error || 'Ocurrió un error inesperado al subir el material.';
                }
            });
    }

    // Flujo Alternativo 2: Cancelar
    onCancel(): void {
        // Navegar a la sección de cursos del docente
        this.router.navigate(['/docente/mis-cursos']);
    }
}