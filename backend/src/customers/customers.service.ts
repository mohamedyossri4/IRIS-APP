import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const customer = this.customersRepository.create(createCustomerDto);
        return this.customersRepository.save(customer);
    }

    findAll(): Promise<Customer[]> {
        return this.customersRepository.find();
    }

    async findOne(id: number): Promise<Customer> {
        const customer = await this.customersRepository.findOne({ where: { id } });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        const customer = await this.findOne(id);
        Object.assign(customer, updateCustomerDto);
        return this.customersRepository.save(customer);
    }

    async remove(id: number): Promise<void> {
        const result = await this.customersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
    }
}
