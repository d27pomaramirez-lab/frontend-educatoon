export interface CrearMaterialRequest {
    nombre: string;
    descripcion: string;
    // Nota: El archivo se manejará fuera del objeto JSON, dentro de FormData
}