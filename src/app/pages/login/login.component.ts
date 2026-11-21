import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LoginRequest } from '../../core/models/LoginRequest';
import { LoginResponse } from '../../core/models/LoginResponse';
import { UserService } from '../../core/service/user.service';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loginForm: FormGroup = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitted = false;
  loading = false;
  errorMessage = '';
  loginResponse: LoginResponse | null = null;

  get form() {
    return this.loginForm.controls;
  }

  get maskedToken(): string {
    const token = this.loginResponse?.token ?? '';
    return token.slice(0, 9) + '*'.repeat(Math.max(0, token.length - 9));
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.loginResponse = null;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials: LoginRequest = this.loginForm.getRawValue();
    this.loading = true;

    this.userService
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loginResponse = response;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message ?? 'La connexion a échoué.';
          this.loading = false;
        },
      });
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.loginResponse = null;
    this.loginForm.reset();
  }
}
