import { GestionarAsesoriaDocenteComponent } from './pages/gestionar-asesoria-docente/gestionar.asesoria.docente.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminPanelComponent } from './pages/admin-panel/admin.panel.component';
import { RegisterComponent } from './pages/register/register.component';
import { CoordinadorPanelComponent } from './pages/coordinador-panel/coordinador.panel.component';
import { PublicLayoutComponent } from './layout/public-layout/public.layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin.layout.component';
import { UserManagementComponent } from './pages/user-management/user.management.component';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { GestionAsesoriasComponent } from './pages/gestion-asesorias/gestion.asesorias.component';
import { GestionSeccionesComponent } from './pages/gestion-secciones/gestion.secciones.component'; 
import { PerfilComponent } from './pages/perfil/perfil.component'; // Agregar esta importación
import { GestionCursosComponent } from './pages/gestion-cursos/gestion.cursos.component';
import { GestionMatriculasComponent } from './pages/gestion-matriculas/gestion-matriculas.component';
import { RegistroPruebasComponent } from './pages/registro-pruebas/registro-pruebas.component';
import { ReporteAsignacionesComponent } from './pages/reporte-asignaciones/reporte-asignaciones.component';
import { GestionarAsesoriaEstudianteComponent } from './pages/estudiante-asesoria/asesoria-estudiante/asesoria.estudiante.component';

export const routes: Routes = [   

  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegisterComponent },
    ]
  },

  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'perfil/:id',
        component: PerfilComponent 
      },
      { 
        path: 'admin', 
        component: AdminPanelComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_ADMINISTRADOR'] }
      },      
      {
        path: 'gestion-usuarios',
        component: UserManagementComponent,
        canActivate: [authGuard, roleGuard], 
        data: {
          roles: ['ROL_ADMINISTRADOR']
        }
      },
      {
        path: 'coordinador',
        component: CoordinadorPanelComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_COORDINADOR'] }
      },
      {
        path: 'coordinador/asesorias',
        component: GestionAsesoriasComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_COORDINADOR'] }
      },
      {
        path: 'coordinador/secciones',
        component: GestionSeccionesComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_COORDINADOR'] }
      },
      {
        path: 'coordinador/cursos',
        component: GestionCursosComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_COORDINADOR'] }
      },
      {
        path: 'docente/asesorias',
        component: GestionarAsesoriaDocenteComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_DOCENTE'] }
      },
      {
        path: 'estudiante/asesorias',
        component: GestionarAsesoriaEstudianteComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_ESTUDIANTE'] }
      },
      {
        path: 'gestion-matriculas',
        component: GestionMatriculasComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_ADMINISTRADOR', 'ROL_COORDINADOR'] }
      },
      {
        path: 'registro-pruebas',
        component: RegistroPruebasComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_COORDINADOR'] }
      },
      {
        path: 'reporte-asignaciones',
        component: ReporteAsignacionesComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROL_ADMINISTRADOR', 'ROL_COORDINADOR'] }
      }
    ]
  },

  { path: '**', redirectTo: 'inicio' }
];