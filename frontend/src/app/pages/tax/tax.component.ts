import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxService } from '../../services/tax.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-tax',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Tax Configuration</h1>
          <p class="text-muted">Manage tax rates</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">
          <span>➕</span> Add Tax Rate
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rate (%)</th>
              <th>Default</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of taxConfigs">
              <td>{{ t.name }}</td>
              <td>{{ t.rate }}%</td>
              <td><span *ngIf="t.isDefault" class="badge badge-success">Yes</span></td>
              <td><span class="badge" [ngClass]="t.isActive ? 'badge-success' : 'badge-gray'">{{ t.isActive ? 'Active' : 'Inactive' }}</span></td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(t.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Add Tax Rate</h2>
          <form (ngSubmit)="save()">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Rate (%) *</label>
              <input type="number" [(ngModel)]="formData.rate" name="rate" step="0.01" required>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="formData.isDefault" name="isDefault">
                Set as default
              </label>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="formData.isActive" name="isActive">
                Active
              </label>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
              <button type="button" class="btn btn-secondary" (click)="showForm = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: var(--spacing-xl); }
    .page-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-xl); }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background-color: var(--secondary-black); border: 1px solid var(--border-gray); border-radius: var(--radius-lg); padding: var(--spacing-xl); max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
    td button { margin-right: var(--spacing-sm); }
  `]
})
export class TaxComponent implements OnInit {
    taxConfigs: any[] = [];
    loading = true;
    showForm = false;
    formData: any = { isActive: true, isDefault: false };

    constructor(private service: TaxService) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (data) => { this.taxConfigs = data; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; }
        });
    }

    save(): void {
        this.service.create(this.formData).subscribe({ next: () => { this.load(); this.showForm = false; this.formData = { isActive: true, isDefault: false }; } });
    }

    delete(id: number): void {
        if (confirm('Delete this tax configuration?')) {
            this.service.delete(id).subscribe({ next: () => this.load() });
        }
    }
}
