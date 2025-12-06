import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice)
        private invoicesRepository: Repository<Invoice>,
    ) { }

    async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        const invoiceNumber = await this.generateInvoiceNumber();

        // Calculate line item totals and tax amounts
        const calculatedItems = createInvoiceDto.items.map(item => {
            const lineTotal = item.quantity * item.unitPrice;
            const taxAmount = lineTotal * (item.taxPercentage / 100);
            const total = lineTotal + taxAmount;

            return {
                ...item,
                lineTotal,
                taxAmount,
                total,
            };
        });

        // Calculate document totals
        const subtotal = calculatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const tax = calculatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
        const total = subtotal + tax;

        const invoice = this.invoicesRepository.create({
            ...createInvoiceDto,
            items: calculatedItems,
            subtotal,
            tax,
            total,
            invoiceNumber,
            status: createInvoiceDto.status || InvoiceStatus.DRAFT,
            paidAmount: 0,
        });
        return this.invoicesRepository.save(invoice);
    }

    async createFromQuotation(quotationId: number, quotationData: any): Promise<Invoice> {
        const invoiceNumber = await this.generateInvoiceNumber();
        const invoice = this.invoicesRepository.create({
            customerId: quotationData.customerId,
            items: quotationData.items,
            subtotal: quotationData.subtotal,
            tax: quotationData.tax,
            total: quotationData.total,
            quotationId,
            invoiceNumber,
            status: InvoiceStatus.DRAFT,
            paidAmount: 0,
        });
        return this.invoicesRepository.save(invoice);
    }

    findAll(): Promise<Invoice[]> {
        return this.invoicesRepository.find({
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Invoice> {
        const invoice = await this.invoicesRepository.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }

    async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        const invoice = await this.findOne(id);
        Object.assign(invoice, updateInvoiceDto);
        return this.invoicesRepository.save(invoice);
    }

    async remove(id: number): Promise<void> {
        const result = await this.invoicesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
    }

    async findByCustomer(customerId: number): Promise<Invoice[]> {
        return this.invoicesRepository.find({
            where: { customerId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByStatus(status: InvoiceStatus): Promise<Invoice[]> {
        return this.invoicesRepository.find({
            where: { status },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async updatePaymentStatus(id: number, paidAmount: number): Promise<Invoice> {
        const invoice = await this.findOne(id);
        invoice.paidAmount = paidAmount;

        if (paidAmount >= invoice.total) {
            invoice.status = InvoiceStatus.PAID;
        } else if (paidAmount > 0) {
            invoice.status = InvoiceStatus.PARTIALLY_PAID;
        }

        return this.invoicesRepository.save(invoice);
    }

    async checkOverdueInvoices(): Promise<void> {
        const today = new Date();
        const overdueInvoices = await this.invoicesRepository.find({
            where: {
                dueDate: LessThan(today),
                status: InvoiceStatus.SENT,
            },
        });

        for (const invoice of overdueInvoices) {
            invoice.status = InvoiceStatus.OVERDUE;
            await this.invoicesRepository.save(invoice);
        }
    }

    private async generateInvoiceNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const count = await this.invoicesRepository.count();
        const number = (count + 1).toString().padStart(5, '0');
        return `INV-${year}-${number}`;
    }
}
