import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('🚫 authGuard: Pas de token, redirection vers /login');
    router.navigate(['/login']);
    return false;
  }
  
  console.log('✅ authGuard: Token trouvé, accès autorisé');
  return true;
};