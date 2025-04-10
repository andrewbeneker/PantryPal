import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pantrypal-ui';
  showNavbar: boolean = true;

  constructor(private router: Router, public userService: UserService) {
    // Hide navbar on login/register pages
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/login', '/register'];
        this.showNavbar = !hiddenRoutes.includes(event.url);
      }
    });
  }

  // This gives the template access to the login status directly
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
