/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ClubEntity } from './club.entity';  
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)  
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async create(club: ClubEntity): Promise<ClubEntity>{
        if (club.descripcion.length > 100) {
            throw new BusinessLogicException("Description exceeds maximum length", BusinessError.PRECONDITION_FAILED);
        }
        return await this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity>{
        const foundClub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!foundClub)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        if (club.descripcion.length > 100) {
            throw new BusinessLogicException("Description exceeds maximum length", BusinessError.PRECONDITION_FAILED);
        }
        return await this.clubRepository.save({...foundClub, ...club});
    }

    async delete(id: string){
        const club = await this.clubRepository.findOne({where:{id}});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        await this.clubRepository.remove(club);
    }

    async findAll(): Promise<ClubEntity[]>{
        return await this.clubRepository.find();
    }

    async findOne(id: string): Promise<ClubEntity>{
        const club = await this.clubRepository.findOne({where:{id}});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        return club;
    }
}
