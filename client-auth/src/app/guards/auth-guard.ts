import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLogged = await this.authService.isLoggedIn();

    if (isLogged) {
      return true; // boleh masuk
    } else {
      this.router.navigate(['/login']); // lempar ke login
      return false;
    }
  }
}
