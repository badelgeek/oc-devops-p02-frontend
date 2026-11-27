import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserService } from '../../core/service/user.service';
import { UserLight } from '../../core/models/UserLight';

@Component({
  selector: 'app-users',
  imports: [RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  users: UserLight[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (response) => {
          this.users = response.users;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.status === 401
              ? 'Unauthorized!'
              : 'Unable to load users. Please try again.';
        },
      });
  }
}
