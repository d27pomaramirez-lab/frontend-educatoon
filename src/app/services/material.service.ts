// src/app/services/material.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Asegúrate de que esta URL coincida con el puerto de tu backend (8080)
const API_URL = 'http://localhost:8080/api/materiales';

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    constructor(private http: HttpClient) { }

    /**
     * Envía el formulario y el archivo al backend usando FormData.
     * @param cursoId El UUID del curso (como string).
     * @param nombre Nombre del material.
     * @param descripcion Descripción del material.
     * @param archivo El objeto File a subir.
     * @returns Observable con la respuesta (mensaje de éxito).
     */
    // *** CORRECCIÓN: cursoId debe ser de tipo string (representación del UUID) ***
    subirMaterial(cursoId: string, nombre: string, descripcion: string, archivo: File): Observable<any> {

        const formData = new FormData();
        // Los nombres de los campos deben coincidir exactamente con los @RequestParam del Controller de Java.
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('archivo', archivo, archivo.name);

        // responseType: 'text' es necesario porque el backend devuelve un String.
        return this.http.post(`${API_URL}/curso/${cursoId}`, formData, { responseType: 'text' });
    }
}