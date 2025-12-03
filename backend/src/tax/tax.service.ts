import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxConfig } from './entities/tax-config.entity';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
import { UpdateTaxConfigDto } from './dto/update-tax-config.dto';

@Injectable()
export class TaxService {
    constructor(
        @InjectRepository(TaxConfig)
        private taxConfigRepository: Repository<TaxConfig>,
    ) { }

    async create(createTaxConfigDto: CreateTaxConfigDto): Promise<TaxConfig> {
        // If setting as default, unset other defaults
        if (createTaxConfigDto.isDefault) {
            await this.taxConfigRepository.update({ isDefault: true }, { isDefault: false });
        }

        const taxConfig = this.taxConfigRepository.create(createTaxConfigDto);
        return this.taxConfigRepository.save(taxConfig);
    }

    findAll(): Promise<TaxConfig[]> {
        return this.taxConfigRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<TaxConfig> {
        const taxConfig = await this.taxConfigRepository.findOne({ where: { id } });
        if (!taxConfig) {
            throw new NotFoundException(`Tax config with ID ${id} not found`);
        }
        return taxConfig;
    }

    async findDefault(): Promise<TaxConfig | null> {
        return this.taxConfigRepository.findOne({ where: { isDefault: true, isActive: true } });
    }

    async update(id: number, updateTaxConfigDto: UpdateTaxConfigDto): Promise<TaxConfig> {
        const taxConfig = await this.findOne(id);

        // If setting as default, unset other defaults
        if (updateTaxConfigDto.isDefault) {
            await this.taxConfigRepository.update({ isDefault: true }, { isDefault: false });
        }

        Object.assign(taxConfig, updateTaxConfigDto);
        return this.taxConfigRepository.save(taxConfig);
    }

    async remove(id: number): Promise<void> {
        const result = await this.taxConfigRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Tax config with ID ${id} not found`);
        }
    }

    async findActive(): Promise<TaxConfig[]> {
        return this.taxConfigRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
}
