import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    getStats() {
        return this.dashboardService.getStats();
    }

    @Get('revenue/monthly')
    getMonthlyRevenue(@Query('year') year?: string) {
        const yearNumber = year ? parseInt(year) : new Date().getFullYear();
        return this.dashboardService.getMonthlyRevenue(yearNumber);
    }

    @Get('customers/top')
    getTopCustomers(@Query('limit') limit?: string) {
        const limitNumber = limit ? parseInt(limit) : 5;
        return this.dashboardService.getTopCustomers(limitNumber);
    }

    @Get('payments/recent')
    getRecentPayments(@Query('limit') limit?: string) {
        const limitNumber = limit ? parseInt(limit) : 10;
        return this.dashboardService.getRecentPayments(limitNumber);
    }

    @Get('invoices/overdue')
    getOverdueInvoices() {
        return this.dashboardService.getOverdueInvoices();
    }
}
