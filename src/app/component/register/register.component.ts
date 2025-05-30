import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../util/services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  successMessage: string | null = null;
  errorMessage: string | null = null;
  successTimeout: any;
  errorTimeout: any;

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl('user', [Validators.required]),
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.getRawValue();
      this.authService.setRegisterForm(userData).subscribe({
        next: (response) => {
          const message = response.message || 'Your account has been created';
          this.successMessage = message;
          this.errorMessage = null;

          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });

          clearTimeout(this.successTimeout);
          this.successTimeout = setTimeout(() => {
            this.successMessage = null;
          }, 4000);

          this.registerForm.reset();

          this.router.navigate(['/login'], {
            state: { successMessage: message },
          });
        },
        error: (error) => {
          const errorMessage =
            error?.error?.message || 'Registration failed. Please try again.';
          this.errorMessage = errorMessage;
          this.successMessage = null;

          console.log(errorMessage);
          console.log(this.errorMessage);

          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });

          clearTimeout(this.errorTimeout);
          this.errorTimeout = setTimeout(() => {
            this.errorMessage = null;
          }, 4000);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  clearError() {
    clearTimeout(this.errorTimeout);
    this.errorMessage = null;
  }

  showPassword = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
