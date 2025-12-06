import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDateString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { QuotationStatus } from '../entities/quotation.entity';

class QuotationItemDto {
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
    taxPercentage: number; // Tax percentage for this line item
}

export class CreateQuotationDto {
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuotationItemDto)
    items: QuotationItemDto[];

    @IsNumber()
    @IsNotEmpty()
    subtotal: number;

    @IsNumber()
    @IsOptional()
    tax?: number;

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsEnum(QuotationStatus)
    @IsOptional()
    status?: QuotationStatus;

    @IsDateString()
    @IsOptional()
    validUntil?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
