import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { UserDetail } from '../../../core/models/UserDetail';
import { UpdateUserRequest } from '../../../core/models/UpdateUserRequest';
import { UserService } from '../../../core/service/user.service';

@Component({
  selector: 'app-user-detail',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly userForm = this.formBuilder.nonNullable.group({
    id: [{ value: 0, disabled: true }],
    firstName: [{ value: '', disabled: true }, Validators.required],
    lastName: [{ value: '', disabled: true }, Validators.required],
    login: [{ value: '', disabled: true }, Validators.required],
    password: [{ value: '', disabled: true }],
    createdAt: [{ value: '', disabled: true }],
  });

  loading = false;
  saving = false;
  deleting = false;
  isEditMode = false;
  confirmDelete = false;
  loadErrorMessage = '';
  errorMessage = '';
  deleteErrorMessage = '';
  successMessage = '';
  private user: UserDetail | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!Number.isInteger(id) || id <= 0) {
      this.loadErrorMessage = 'Invalid user ID.';
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
        next: (user) => {
          this.user = user;
          this.populateUserForm(user);
        },
        error: (error: HttpErrorResponse) => {
          this.loadErrorMessage =
            error.status === 404
              ? 'User not found.'
              : error.status === 401
                ? 'Unauthorized.'
                : 'Unable to load user details.';
        },
      });
  }

  setEditMode(isEditMode: boolean): void {
    this.confirmDelete = false;
    this.isEditMode = isEditMode;
    this.errorMessage = '';
    this.deleteErrorMessage = '';
    this.successMessage = '';

    const editableControls = [
      this.userForm.controls.firstName,
      this.userForm.controls.lastName,
      this.userForm.controls.login,
      this.userForm.controls.password,
    ];
    editableControls.forEach((control) =>
      isEditMode ? control.enable() : control.disable(),
    );
  }

  cancelEditing(): void {
    if (this.user) {
      this.populateUserForm(this.user);
    }
    this.setEditMode(false);
  }

  onSubmitDelete(): void {
    if (!this.confirmDelete) {
      this.confirmDelete = true;
      this.deleteErrorMessage = '';
      return;
    }

    if (!this.user) {
      return;
    }

    this.deleting = true;
    this.userService
      .deleteUser(this.user.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.deleting = false;
          this.confirmDelete = false;
        }),
      )
      .subscribe({
        next: () => this.router.navigate(['/users']),
        error: (error: HttpErrorResponse) => {
          this.deleteErrorMessage =
            error.status === 404
              ? 'User not found.'
              : error.error?.message ?? 'Unable to delete the user.';
        },
      });
  }

  cancelDelete(): void {
    this.confirmDelete = false;
    this.deleteErrorMessage = '';
  }

  onSubmitSave(): void {
    if (!this.user || this.userForm.invalid) {
      return;
    }

    const values = this.userForm.getRawValue();
    const updateRequest: UpdateUserRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      login: values.login,
      ...(values.password.trim() ? { password: values.password } : {}),
    };

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService
      .updateUser(this.user.id, updateRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.saving = false)),
      )
      .subscribe({
        next: (user) => {
          this.user = user;
          this.populateUserForm(user);
          this.setEditMode(false);
          this.successMessage = 'User updated successfully.';
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.status === 404
              ? 'User not found.'
              : (error.error?.message ?? 'Unable to update the user.');
        },
      });
  }

  private populateUserForm(user: UserDetail): void {
    this.userForm.patchValue({
      ...user,
      password: '',
      createdAt: new Date(user.createdAt).toLocaleString(),
    });
  }
}
