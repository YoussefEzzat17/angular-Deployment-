import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

export const loggedGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _AuthService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = _AuthService.getTokenFromCookies();
    if (token) {
      const user = jwtDecode<DecodedToken>(token);
      console.log('🚀 ~ user:', user);
      if (user.role === 'admin') {
        _Router.navigate(['/dashboard/mainDashboard']);
        return false;
      } else {
        _Router.navigate(['/home']);
        return false;
      }
    }
    return true;
  }
  return false;
};
