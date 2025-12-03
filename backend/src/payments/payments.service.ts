import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        private invoicesService: InvoicesService,
    ) { }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = this.paymentsRepository.create(createPaymentDto);
        const savedPayment = await this.paymentsRepository.save(payment);

        // Update invoice paid amount
        await this.updateInvoicePaidAmount(createPaymentDto.invoiceId);

        return savedPayment;
    }

    findAll(): Promise<Payment[]> {
        return this.paymentsRepository.find({
            relations: ['invoice', 'invoice.customer'],
            order: { paymentDate: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['invoice', 'invoice.customer'],
        });
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }

    async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.findOne(id);
        const oldInvoiceId = payment.invoiceId;
        Object.assign(payment, updatePaymentDto);
        const updatedPayment = await this.paymentsRepository.save(payment);

        // Update invoice paid amounts
        await this.updateInvoicePaidAmount(payment.invoiceId);
        if (oldInvoiceId !== payment.invoiceId) {
            await this.updateInvoicePaidAmount(oldInvoiceId);
        }

        return updatedPayment;
    }

    async remove(id: number): Promise<void> {
        const payment = await this.findOne(id);
        const invoiceId = payment.invoiceId;
        const result = await this.paymentsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        // Update invoice paid amount after deletion
        await this.updateInvoicePaidAmount(invoiceId);
    }

    async findByInvoice(invoiceId: number): Promise<Payment[]> {
        return this.paymentsRepository.find({
            where: { invoiceId },
            order: { paymentDate: 'DESC' },
        });
    }

    private async updateInvoicePaidAmount(invoiceId: number): Promise<void> {
        const payments = await this.findByInvoice(invoiceId);
        const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        await this.invoicesService.updatePaymentStatus(invoiceId, totalPaid);
    }
}
