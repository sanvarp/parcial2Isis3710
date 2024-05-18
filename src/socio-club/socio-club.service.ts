/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioClubService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,

        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ) {}

    async addMemberToClub(idClub: string, idSocio: string): Promise<ClubEntity> {
        const socio = await this.socioRepository.findOne({where: {id: idSocio}});
        if (!socio)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);

        const club = await this.clubRepository.findOne({where: {id: idClub}, relations: ["socios"]});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);

        club.socios = [...club.socios, socio];

        return await this.clubRepository.save(club);
    }

    async findMembersFromClub(idClub: string): Promise<SocioEntity[]> {
        const club = await this.clubRepository.findOne({where: {id: idClub}, relations: ["socios"]});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        
        return club.socios;
    }

    async findMemberFromClub(idClub: string, idSocio: string): Promise<SocioEntity> {
        const club = await this.clubRepository.findOne({where: {id: idClub}, relations: ["socios"]});
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);

        const socio = club.socios.find(s => s.id === idSocio);
        if (!socio)
            throw new BusinessLogicException("The member with the given id is not found in the club", BusinessError.PRECONDITION_FAILED);

        return socio;
    }

    async updateMembersFromClub(idClub: string, socios: SocioEntity[]): Promise<ClubEntity> {
        // Buscar el club por ID
        const club = await this.clubRepository.findOne({where: {id: idClub}});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        }

        // Verificar la existencia de cada socio por su ID
        for (let i = 0; i < socios.length; i++) {
            const socio = await this.socioRepository.findOne({where: {id: socios[i].id}});
            if (!socio) {
                throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
            }
        }

        // Asignar los socios verificados al club
        club.socios = socios;

        // Guardar y devolver el club actualizado
        return await this.clubRepository.save(club);
    }
    

    async deleteMemberFromClub(idClub: string, idSocio: string): Promise<ClubEntity> {
        const club = await this.clubRepository.findOne({where: {id: idClub}, relations: ["socios"]});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        }

        // Verificar si el socio es parte del club
        const socioEnClub = club.socios.find(s => s.id === idSocio);
        if (!socioEnClub) {
            throw new BusinessLogicException("The member with the given id is not part of the club", BusinessError.PRECONDITION_FAILED);
        }

        // Eliminar el socio del club
        club.socios = club.socios.filter(s => s.id !== idSocio);
        return await this.clubRepository.save(club);
    }
}
