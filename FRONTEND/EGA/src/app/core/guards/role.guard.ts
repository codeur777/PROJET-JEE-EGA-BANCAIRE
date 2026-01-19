import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

// Guards pour rôles spécifiques
export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.hasRole('ADMIN')) {
    return true;
  }

  console.warn('❌ Accès refusé : Seuls les admins peuvent accéder à cette page');
  router.navigate(['/home']);
  return false;
};

export const agentGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.hasRole('AGENT')) {
    return true;
  }

  console.warn('❌ Accès refusé : Seuls les agents peuvent accéder à cette page');
  router.navigate(['/home']);
  return false;
};

export const clientGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.hasRole('CLIENT') || tokenService.hasRole('USER')) {
    return true;
  }

  console.warn('❌ Accès refusé : Seuls les clients peuvent accéder à cette page');
  router.navigate(['/login']);
  return false;
};

export const notAdminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.hasRole('ADMIN')) {
    console.warn('❌ Admin ne peut pas accéder à cette page');
    router.navigate(['/admin']);
    return false;
  }

  return true;
};

export const notClientGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.hasRole('CLIENT') || tokenService.hasRole('USER')) {
    console.warn('❌ Client ne peut pas accéder à cette page');
    router.navigate(['/client/dashboard']);
    return false;
  }

  return true;
};

export const noReleveForClientsGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (tokenService.hasRole('CLIENT') || tokenService.hasRole('USER')) {
    console.warn('❌ Les clients ne peuvent pas accéder aux relevés');
    router.navigate(['/client/dashboard']);
    return false;
  }

  return true;
};
