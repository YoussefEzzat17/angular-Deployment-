import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../util/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forget-password-verification',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, RouterModule],
  templateUrl: './forget-password-verification.component.html',
  styleUrls: ['./forget-password-verification.component.css']
})
export class ForgetPasswordVerificationComponent {
  resetPasswordForm = new FormGroup({
    code: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  showPassword = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    const providedCode  = this.resetPasswordForm.value.code ?? '';
    const newPassword = this.resetPasswordForm.value.newPassword ?? '';

    this.authService.verifyForgetPassword( providedCode , newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password reset successful!';
        this.errorMessage = null;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error resetting password:', err.message);
        this.errorMessage = 'Failed to reset password. Please check your code and then try again.';
        this.successMessage = null;
      }
    });
  }

  clearSuccess() {
    this.successMessage = null;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
