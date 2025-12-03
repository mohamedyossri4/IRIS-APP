import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ContractStatus } from '../entities/contract.entity';

export class CreateContractDto {
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsEnum(ContractStatus)
    @IsOptional()
    status?: ContractStatus;

    @IsDateString()
    @IsOptional()
    renewalDate?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
