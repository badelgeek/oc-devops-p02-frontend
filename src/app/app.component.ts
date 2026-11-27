import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './core/service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterLink, RouterOutlet],
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly userService = inject(UserService);

  title = 'etudiant-frontend';
}
