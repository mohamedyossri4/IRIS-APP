import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="text-muted">Overview of your business</p>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading && stats" class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon revenue">💰</div>
          <div class="stat-content">
            <h3>Total Revenue</h3>
            <p class="stat-value">\${{ stats.totalRevenue | number:'1.2-2' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon outstanding">📊</div>
          <div class="stat-content">
            <h3>Outstanding</h3>
            <p class="stat-value">\${{ stats.totalOutstanding | number:'1.2-2' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon expenses">💸</div>
          <div class="stat-content">
            <h3>Total Expenses</h3>
            <p class="stat-value">\${{ stats.totalExpenses | number:'1.2-2' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon net">📈</div>
          <div class="stat-content">
            <h3>Net Income</h3>
            <p class="stat-value">\${{ stats.netIncome | number:'1.2-2' }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon customers">👥</div>
          <div class="stat-content">
            <h3>Total Customers</h3>
            <p class="stat-value">{{ stats.totalCustomers }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon overdue">⚠️</div>
          <div class="stat-content">
            <h3>Overdue Invoices</h3>
            <p class="stat-value">{{ stats.overdueInvoices }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && recentPayments.length > 0" class="recent-section">
        <h2>Recent Payments</h2>
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payment of recentPayments">
                <td>{{ payment.paymentDate | date:'short' }}</td>
                <td>{{ payment.invoice?.invoiceNumber }}</td>
                <td>{{ payment.invoice?.customer?.name }}</td>
                <td>\${{ payment.amount | number:'1.2-2' }}</td>
                <td><span class="badge badge-info">{{ payment.paymentMethod }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding: var(--spacing-xl);
    }

    .dashboard-header {
      margin-bottom: var(--spacing-2xl);
    }

    .dashboard-header h1 {
      margin-bottom: var(--spacing-sm);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background-color: var(--secondary-black);
      border: 1px solid var(--border-gray);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.revenue { background-color: rgba(34, 197, 94, 0.2); }
    .stat-icon.outstanding { background-color: rgba(245, 158, 11, 0.2); }
    .stat-icon.expenses { background-color: rgba(220, 38, 38, 0.2); }
    .stat-icon.net { background-color: rgba(59, 130, 246, 0.2); }
    .stat-icon.customers { background-color: rgba(168, 85, 247, 0.2); }
    .stat-icon.overdue { background-color: rgba(239, 68, 68, 0.2); }

    .stat-content h3 {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 var(--spacing-xs) 0;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .recent-section {
      margin-top: var(--spacing-2xl);
    }

    .recent-section h2 {
      margin-bottom: var(--spacing-lg);
    }
  `]
})
export class DashboardComponent implements OnInit {
    loading = true;
    stats: any = null;
    recentPayments: any[] = [];

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.loadDashboard();
    }

    loadDashboard(): void {
        this.dashboardService.getStats().subscribe({
            next: (data) => {
                this.stats = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading dashboard:', err);
                this.loading = false;
            }
        });

        this.dashboardService.getRecentPayments(5).subscribe({
            next: (data) => {
                this.recentPayments = data;
            }
        });
    }
}
