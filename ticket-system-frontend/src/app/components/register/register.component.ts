import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { runtimeConfig } from '../../../environments/runtime-config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private apiUrl = runtimeConfig.apiUrl || environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.email || !this.password) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post(`${this.apiUrl}/register`, {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed.';
        this.isLoading = false;
      }
    });
  }
}
