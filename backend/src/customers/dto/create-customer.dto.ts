import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { CustomerType } from '../entities/customer.entity';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    taxId?: string;

    @IsEnum(CustomerType)
    @IsOptional()
    customerType?: CustomerType;
}
