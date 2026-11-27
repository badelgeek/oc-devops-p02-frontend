import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CreateUserRequest } from '../../core/models/CreateUserRequest';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly createUserForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitted = false;
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.createUserForm.invalid) {
      return;
    }

    const newUser: CreateUserRequest = this.createUserForm.getRawValue();
    this.loading = true;

    this.userService
      .addUser(newUser)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: () => this.router.navigate(['/users']),
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.message ?? 'Unable to create the user';
        },
      });
  }
}
