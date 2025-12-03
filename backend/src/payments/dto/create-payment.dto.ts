import { IsNumber, IsNotEmpty, IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    invoiceId: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    paymentDate: string;

    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod: PaymentMethod;

    @IsString()
    @IsOptional()
    reference?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
