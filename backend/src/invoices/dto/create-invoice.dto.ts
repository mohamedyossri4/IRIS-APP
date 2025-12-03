import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDateString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../entities/invoice.entity';

class InvoiceItemDto {
    @IsNumber()
    @IsOptional()
    productId?: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @IsNumber()
    @IsNotEmpty()
    total: number;
}

export class CreateInvoiceDto {
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];

    @IsNumber()
    @IsNotEmpty()
    subtotal: number;

    @IsNumber()
    @IsOptional()
    tax?: number;

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsEnum(InvoiceStatus)
    @IsOptional()
    status?: InvoiceStatus;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsNumber()
    @IsOptional()
    quotationId?: number;
}
