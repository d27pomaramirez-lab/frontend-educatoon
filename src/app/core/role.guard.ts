import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const roleGuard: CanActivateFn = (route, state) => {

    const storageService = inject(StorageService);
    const router = inject(Router);

    const rolesPermitidos = route.data['roles'] as Array<string>;

    const usuario = storageService.getUser();

    if (!usuario || !usuario.authorities) {
      console.error('RoleGuard: No se encontró información del usuario.');
      return router.parseUrl('/login');
    }

    const rolUsuario = usuario.authorities[0]?.authority;

    if (rolesPermitidos.includes(rolUsuario)) {
      return true;
    } else {
      console.warn(`RoleGuard: Acceso denegado. Se requiere [${rolesPermitidos}], pero el usuario tiene [${rolUsuario}]`);
      return router.parseUrl('/dashboard'); 
    }
    
};
