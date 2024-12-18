import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;
  isDropdownVisible = false;

  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.cookieService.get('authToken');
    this.userRole = this.cookieService.get('userRole');
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isInsideDropdown = target.closest('.dropdown-container');
    if (!isInsideDropdown) {
      this.isDropdownVisible = false;
    }
  }

  logout(): void {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userRole');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}