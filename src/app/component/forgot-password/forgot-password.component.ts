import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../util/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email ?? '';
      this.authService.forgetPassword(email).subscribe({
        next: () => {
          this.successMessage =
            'Verification code sent! Please check your email.';
          this.errorMessage = null;

          this.snackBar.open(this.successMessage, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });

          // Redirect after a short delay (optional)
          setTimeout(() => {
            this.router.navigate(['/forgot-password-verification']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage =
            'Failed to send the verification code. Please check your email or try again.';

          this.snackBar.open(this.errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });

          this.successMessage = null;
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  clearSuccess() {
    this.successMessage = null;
  }
}
