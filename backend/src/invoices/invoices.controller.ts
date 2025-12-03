import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvoiceStatus } from './entities/invoice.entity';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto);
    }

    @Get()
    findAll(@Query('status') status?: InvoiceStatus, @Query('customerId') customerId?: string) {
        if (status) {
            return this.invoicesService.findByStatus(status);
        }
        if (customerId) {
            return this.invoicesService.findByCustomer(parseInt(customerId));
        }
        return this.invoicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.invoicesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
        return this.invoicesService.update(+id, updateInvoiceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.invoicesService.remove(+id);
    }

    @Post('check-overdue')
    checkOverdue() {
        return this.invoicesService.checkOverdueInvoices();
    }
}
