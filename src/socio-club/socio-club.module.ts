/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { SocioClubService } from './socio-club.service';
import { ClubSocioController } from './socio-club.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
    providers: [SocioClubService],
    controllers: [ClubSocioController],
})
export class SocioClubModule {}
