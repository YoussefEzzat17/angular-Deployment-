import { Component, inject, OnInit } from '@angular/core';
import { NavLinksComponent } from '../nav-links/nav-links.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../util/services/feedback.service';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _FeedbackService = inject(FeedbackService);
  private readonly _Router = inject(Router);
  url: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  FeedBackForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[012]\d{8}$/),
    ]),
    message: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });
  ngOnInit() {
    this.url = this._ActivatedRoute.snapshot.routeConfig?.path as string;
  }
  submit() {
    if (this.FeedBackForm.valid) {
      this._FeedbackService.sendFeedback(this.FeedBackForm.value).subscribe({
        next: (res) => {
          console.log(res, 'hhhhh');
          this.successMessage = res.message;
          setTimeout(() => {
            this._Router.navigate(['/home']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
  }
}
