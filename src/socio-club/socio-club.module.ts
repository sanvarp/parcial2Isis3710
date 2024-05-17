/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { SocioClubService } from './socio-club.service';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
    providers: [SocioClubService],
})
export class SocioClubModule {}
