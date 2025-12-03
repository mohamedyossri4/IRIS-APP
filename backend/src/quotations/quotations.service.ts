import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation, QuotationStatus } from './entities/quotation.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

@Injectable()
export class QuotationsService {
    constructor(
        @InjectRepository(Quotation)
        private quotationsRepository: Repository<Quotation>,
    ) { }

    async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
        const quotationNumber = await this.generateQuotationNumber();
        const quotation = this.quotationsRepository.create({
            ...createQuotationDto,
            quotationNumber,
            status: createQuotationDto.status || QuotationStatus.DRAFT,
        });
        return this.quotationsRepository.save(quotation);
    }

    findAll(): Promise<Quotation[]> {
        return this.quotationsRepository.find({
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Quotation> {
        const quotation = await this.quotationsRepository.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!quotation) {
            throw new NotFoundException(`Quotation with ID ${id} not found`);
        }
        return quotation;
    }

    async update(id: number, updateQuotationDto: UpdateQuotationDto): Promise<Quotation> {
        const quotation = await this.findOne(id);
        Object.assign(quotation, updateQuotationDto);
        return this.quotationsRepository.save(quotation);
    }

    async remove(id: number): Promise<void> {
        const result = await this.quotationsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Quotation with ID ${id} not found`);
        }
    }

    async findByCustomer(customerId: number): Promise<Quotation[]> {
        return this.quotationsRepository.find({
            where: { customerId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByStatus(status: QuotationStatus): Promise<Quotation[]> {
        return this.quotationsRepository.find({
            where: { status },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    private async generateQuotationNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const count = await this.quotationsRepository.count();
        const number = (count + 1).toString().padStart(5, '0');
        return `QT-${year}-${number}`;
    }
}
