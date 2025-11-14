import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminPanelComponent } from './pages/admin-panel/admin.panel.component';
import { RegisterComponent } from './pages/register/register.component';
import { CoordinadorPanelComponent } from './pages/coordinador-panel/coordinador.panel.component';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [    
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROL_ADMINISTRADOR'] } },
    { path: 'coordinador', component: CoordinadorPanelComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROL_COORDINADOR', 'ROL_ADMINISTRADOR'] } },
    { path: '**', redirectTo: 'inicio' } 
];