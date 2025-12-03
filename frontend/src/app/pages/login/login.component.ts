import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>IRIS</h1>
          <p>Invoice Management System</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label>Username</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Enter username"
              required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Enter password"
              required>
          </div>
          
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading">
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading">Logging in...</span>
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-black) 0%, var(--secondary-black) 100%);
      padding: var(--spacing-md);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background-color: var(--secondary-black);
      border: 1px solid var(--border-gray);
      border-radius: var(--radius-lg);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-lg);
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .login-header h1 {
      color: var(--primary-red);
      font-size: 2.5rem;
      margin-bottom: var(--spacing-sm);
      font-weight: 700;
    }

    .login-header p {
      color: var(--text-muted);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .error-message {
      padding: var(--spacing-md);
      background-color: rgba(220, 38, 38, 0.1);
      border: 1px solid var(--danger);
      border-radius: var(--radius-md);
      color: var(--danger);
      font-size: 0.875rem;
    }

    button[type="submit"] {
      width: 100%;
      margin-top: var(--spacing-md);
    }
  `]
})
export class LoginComponent {
    username = '';
    password = '';
    loading = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.username || !this.password) {
            this.error = 'Please enter username and password';
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.error = err.error?.message || 'Login failed. Please check your credentials.';
                this.loading = false;
            }
        });
    }
}
