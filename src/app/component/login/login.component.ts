import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import Router for navigation
import { AuthService } from '../../util/services/auth.service';
// import { LoginService } from './login.service'; // Import the LoginService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
   showPassword = false;
  loginError: string | null = null; // <-- error message variable

  router = inject(Router);

  successMessage: string | null = null;
  constructor(private authService: AuthService) {
    const nav = this.router.getCurrentNavigation();
    this.successMessage = nav?.extras?.state?.['successMessage'] || null;

    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = null;
      }, 4000);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.setLoginForm(loginData).subscribe({
        next: (response) => {
          const token = response.token;

          if (token) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 90);
            document.cookie = `userToken=${token}; expires=${expiryDate.toUTCString()}; path=/;`;
            this.loginError = null;

            this.router.navigate(['/home']);
          } else {
            this.loginError = 'Unexpected response from server.';
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.loginError = 'Incorrect email or password.';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  clearSuccess() {
    this.successMessage = null;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
    
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
