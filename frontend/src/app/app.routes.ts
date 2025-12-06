import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
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
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'customers', component: CustomersComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'quotations', component: QuotationsComponent },
            { path: 'invoices', component: InvoicesComponent },
            { path: 'payments', component: PaymentsComponent },
            { path: 'expenses', component: ExpensesComponent },
            { path: 'contracts', component: ContractsComponent },
            { path: 'tax', component: TaxComponent },
        ]
    }
];
