import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../util/services/auth.service';

@Component({
  selector: 'app-auth-navbar',
  imports: [RouterModule],
  templateUrl: './auth-navbar.component.html',
  styleUrl: './auth-navbar.component.css',
})
export class AuthNavbarComponent {

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logOut();
  }
}
