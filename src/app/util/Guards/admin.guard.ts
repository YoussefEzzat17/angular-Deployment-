import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

export const adminGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _AuthService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = _AuthService.getTokenFromCookies();
    if (token) {
      const user = jwtDecode<DecodedToken>(token);
      if (user.role === 'admin') {
        return true;
      } else {
        _Router.navigate(['/home']);
        return false;
      }
    } else {
      _Router.navigate(['/login']);
      return false;
    }
  }
  return false;
};
