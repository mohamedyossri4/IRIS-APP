import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../invoices/entities/invoice.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Invoice)
        private invoicesRepository: Repository<Invoice>,
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Expense)
        private expensesRepository: Repository<Expense>,
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    async getStats() {
        const [
            totalRevenue,
            totalOutstanding,
            totalExpenses,
            totalCustomers,
            recentPayments,
            overdueInvoices,
        ] = await Promise.all([
            this.getTotalRevenue(),
            this.getTotalOutstanding(),
            this.getTotalExpenses(),
            this.getTotalCustomers(),
            this.getRecentPayments(5),
            this.getOverdueInvoices(),
        ]);

        return {
            totalRevenue,
            totalOutstanding,
            totalExpenses,
            netIncome: totalRevenue - totalExpenses,
            totalCustomers,
            recentPayments,
            overdueInvoices: overdueInvoices.length,
        };
    }

    async getTotalRevenue(): Promise<number> {
        const result = await this.invoicesRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.paidAmount)', 'total')
            .getRawOne();
        return Number(result.total) || 0;
    }

    async getTotalOutstanding(): Promise<number> {
        const result = await this.invoicesRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total - invoice.paidAmount)', 'total')
            .where('invoice.status != :status', { status: InvoiceStatus.PAID })
            .andWhere('invoice.status != :cancelled', { cancelled: InvoiceStatus.CANCELLED })
            .getRawOne();
        return Number(result.total) || 0;
    }

    async getTotalExpenses(): Promise<number> {
        const result = await this.expensesRepository
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .getRawOne();
        return Number(result.total) || 0;
    }

    async getTotalCustomers(): Promise<number> {
        return this.customersRepository.count();
    }

    async getRecentPayments(limit: number = 10): Promise<Payment[]> {
        return this.paymentsRepository.find({
            relations: ['invoice', 'invoice.customer'],
            order: { paymentDate: 'DESC' },
            take: limit,
        });
    }

    async getOverdueInvoices(): Promise<Invoice[]> {
        return this.invoicesRepository.find({
            where: { status: InvoiceStatus.OVERDUE },
            relations: ['customer'],
        });
    }

    async getMonthlyRevenue(year: number): Promise<any[]> {
        const result = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('EXTRACT(MONTH FROM payment.paymentDate)', 'month')
            .addSelect('SUM(payment.amount)', 'total')
            .where('EXTRACT(YEAR FROM payment.paymentDate) = :year', { year })
            .groupBy('EXTRACT(MONTH FROM payment.paymentDate)')
            .orderBy('month', 'ASC')
            .getRawMany();

        return result.map(r => ({
            month: parseInt(r.month),
            total: Number(r.total),
        }));
    }

    async getTopCustomers(limit: number = 5): Promise<any[]> {
        const result = await this.invoicesRepository
            .createQueryBuilder('invoice')
            .select('invoice.customerId', 'customerId')
            .addSelect('customer.name', 'customerName')
            .addSelect('SUM(invoice.paidAmount)', 'totalPaid')
            .leftJoin('invoice.customer', 'customer')
            .groupBy('invoice.customerId')
            .addGroupBy('customer.name')
            .orderBy('totalPaid', 'DESC')
            .limit(limit)
            .getRawMany();

        return result.map(r => ({
            customerId: r.customerId,
            customerName: r.customerName,
            totalPaid: Number(r.totalPaid),
        }));
    }
}
