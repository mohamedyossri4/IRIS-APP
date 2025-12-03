import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
    constructor(
        @InjectRepository(Contract)
        private contractsRepository: Repository<Contract>,
    ) { }

    create(createContractDto: CreateContractDto): Promise<Contract> {
        const contract = this.contractsRepository.create({
            ...createContractDto,
            status: createContractDto.status || ContractStatus.ACTIVE,
        });
        return this.contractsRepository.save(contract);
    }

    findAll(): Promise<Contract[]> {
        return this.contractsRepository.find({
            relations: ['customer'],
            order: { startDate: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Contract> {
        const contract = await this.contractsRepository.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!contract) {
            throw new NotFoundException(`Contract with ID ${id} not found`);
        }
        return contract;
    }

    async update(id: number, updateContractDto: UpdateContractDto): Promise<Contract> {
        const contract = await this.findOne(id);
        Object.assign(contract, updateContractDto);
        return this.contractsRepository.save(contract);
    }

    async remove(id: number): Promise<void> {
        const result = await this.contractsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Contract with ID ${id} not found`);
        }
    }

    async findByCustomer(customerId: number): Promise<Contract[]> {
        return this.contractsRepository.find({
            where: { customerId },
            relations: ['customer'],
            order: { startDate: 'DESC' },
        });
    }

    async findByStatus(status: ContractStatus): Promise<Contract[]> {
        return this.contractsRepository.find({
            where: { status },
            relations: ['customer'],
            order: { startDate: 'DESC' },
        });
    }

    async findExpiring(days: number = 30): Promise<Contract[]> {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        return this.contractsRepository.find({
            where: {
                endDate: LessThan(futureDate),
                status: ContractStatus.ACTIVE,
            },
            relations: ['customer'],
            order: { endDate: 'ASC' },
        });
    }

    async checkExpiredContracts(): Promise<void> {
        const today = new Date();
        const expiredContracts = await this.contractsRepository.find({
            where: {
                endDate: LessThan(today),
                status: ContractStatus.ACTIVE,
            },
        });

        for (const contract of expiredContracts) {
            contract.status = ContractStatus.EXPIRED;
            await this.contractsRepository.save(contract);
        }
    }
}
