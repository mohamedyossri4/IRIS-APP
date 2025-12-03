import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>IRIS</h2>
        <p class="text-muted">Invoice Management</p>
      </div>
      
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
          <span>Dashboard</span>
        </a>
        
        <div class="nav-section">Sales</div>
        <a routerLink="/quotations" routerLinkActive="active" class="nav-item">
          <span class="icon">📝</span>
          <span>Quotations</span>
        </a>
        <a routerLink="/invoices" routerLinkActive="active" class="nav-item">
          <span class="icon">🧾</span>
          <span>Invoices</span>
        </a>
        <a routerLink="/payments" routerLinkActive="active" class="nav-item">
          <span class="icon">💳</span>
          <span>Payments</span>
        </a>
        
        <div class="nav-section">Management</div>
        <a routerLink="/customers" routerLinkActive="active" class="nav-item">
          <span class="icon">👥</span>
          <span>Customers</span>
        </a>
        <a routerLink="/products" routerLinkActive="active" class="nav-item">
          <span class="icon">📦</span>
          <span>Products</span>
        </a>
        <a routerLink="/contracts" routerLinkActive="active" class="nav-item">
          <span class="icon">📄</span>
          <span>Contracts</span>
        </a>
        <a routerLink="/expenses" routerLinkActive="active" class="nav-item">
          <span class="icon">💰</span>
          <span>Expenses</span>
        </a>
        
        <div class="nav-section">Settings</div>
        <a routerLink="/tax" routerLinkActive="active" class="nav-item">
          <span class="icon">⚙️</span>
          <span>Tax Config</span>
        </a>
      </nav>
    </aside>
  `,
    styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background-color: var(--secondary-black);
      border-right: 1px solid var(--border-gray);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
    }

    .sidebar-header {
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--border-gray);
    }

    .sidebar-header h2 {
      color: var(--primary-red);
      font-size: 1.5rem;
      margin: 0;
      font-weight: 700;
    }

    .sidebar-header p {
      margin: 0;
      font-size: 0.75rem;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md);
    }

    .nav-section {
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
      padding: 0 var(--spacing-md);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-xs);
      transition: all 0.2s;
    }

    .nav-item:hover {
      background-color: var(--tertiary-black);
      color: var(--text-primary);
    }

    .nav-item.active {
      background-color: var(--primary-red);
      color: white;
    }

    .icon {
      font-size: 1.25rem;
    }
  `]
})
export class SidebarComponent { }
