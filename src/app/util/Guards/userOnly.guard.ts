import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
}

export const userOnlyGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _AuthService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = _AuthService.getTokenFromCookies();
    if (token) {
      const user = jwtDecode<DecodedToken>(token);
      if (user.role === 'user') {
        return true;
      } else {
        _Router.navigate(['/dashboard/mainDashboard']);
        return false;
      }
    } else {
      _Router.navigate(['/login']);
      return false;
    }
  }

  return false;
};
