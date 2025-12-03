import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="header">
      <div class="header-content">
        <div class="header-title">
          <h1>{{ title }}</h1>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary btn-sm" (click)="logout()">
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .header {
      height: 70px;
      background-color: var(--secondary-black);
      border-bottom: 1px solid var(--border-gray);
      position: fixed;
      top: 0;
      left: 250px;
      right: 0;
      z-index: 100;
    }

    .header-content {
      height: 100%;
      padding: 0 var(--spacing-xl);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-title h1 {
      font-size: 1.25rem;
      margin: 0;
      color: var(--text-primary);
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }
  `]
})
export class HeaderComponent {
    title = 'Dashboard';

    constructor(private authService: AuthService) { }

    logout(): void {
        this.authService.logout();
    }
}
