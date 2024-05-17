/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { SocioEntity } from './socio.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity) 
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async create(socio: SocioEntity): Promise<SocioEntity>{
        if (!socio.correoElectronico.includes('@')) {
            throw new BusinessLogicException("Invalid email format", BusinessError.PRECONDITION_FAILED);
        }
        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity>{
        const foundSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!foundSocio)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        if (!socio.correoElectronico.includes('@')) {
            throw new BusinessLogicException("Invalid email format", BusinessError.PRECONDITION_FAILED);
        }
        return await this.socioRepository.save({...foundSocio, ...socio});
    }

    async delete(id: string){
        const socio = await this.socioRepository.findOne({where:{id}});
        if (!socio)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        await this.socioRepository.remove(socio);
    }

    async findAll(): Promise<SocioEntity[]>{
        return await this.socioRepository.find();
    }

    async findOne(id: string): Promise<SocioEntity>{
        const socio = await this.socioRepository.findOne({where:{id}});
        if (!socio)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
        return socio;
    }
}
