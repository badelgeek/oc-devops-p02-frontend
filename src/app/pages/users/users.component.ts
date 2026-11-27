import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { UserService } from '../../core/service/user.service';
import { UserLight } from '../../core/models/UserLight';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);

  users: UserLight[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getUsers()
      .pipe(finalize(() => (this.loading = false)))
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
