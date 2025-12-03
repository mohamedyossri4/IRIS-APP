import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ProductsComponent } from './pages/products/products.component';
import { QuotationsComponent } from './pages/quotations/quotations.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { TaxComponent } from './pages/tax/tax.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'quotations', component: QuotationsComponent, canActivate: [authGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [authGuard] },
    { path: 'payments', component: PaymentsComponent, canActivate: [authGuard] },
    { path: 'expenses', component: ExpensesComponent, canActivate: [authGuard] },
    { path: 'contracts', component: ContractsComponent, canActivate: [authGuard] },
    { path: 'tax', component: TaxComponent, canActivate: [authGuard] },
];
