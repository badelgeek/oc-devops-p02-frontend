import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { UserDetail } from '../../core/models/UserDetail';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-user-detail',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly userForm = this.formBuilder.nonNullable.group({
    id: [{ value: 0, disabled: true }],
    firstName: [{ value: '', disabled: true }],
    lastName: [{ value: '', disabled: true }],
    login: [{ value: '', disabled: true }],
    password: [{ value: '********', disabled: true }],
    createdAt: [{ value: '', disabled: true }],
  });

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid user ID.';
      return;
    }

    this.loading = true;
    this.userService
      .getUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (user: UserDetail) =>
          this.userForm.patchValue({
            ...user,
            createdAt: new Date(user.createdAt).toLocaleString(),
          }),
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.status === 404
              ? 'User not found.'
              : error.status === 401
                ? 'Unauthorized.'
                : 'Unable to load user details.';
        },
      });
  }
}
