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
import { EditUserComponent } from './pages/edit-user/edit.user.component';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { GestionAsesoriasComponent } from './pages/gestion-asesorias/gestion.asesorias.component';

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
        path: 'gestion-usuarios/editar/:id',
        component: EditUserComponent,
        canActivate: [authGuard, roleGuard], 
        data: { roles: ['ROL_ADMINISTRADOR'] }
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
      }
    ]
  },

  { path: '**', redirectTo: 'inicio' }
];