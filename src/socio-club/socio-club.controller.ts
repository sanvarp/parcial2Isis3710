/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioClubService } from './socio-club.service';

@Controller('clubs/:clubId/members')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(private readonly socioClubService: SocioClubService) {}

    @Post(':socioId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.socioClubService.addMemberToClub(clubId, socioId);
    }

    @Get()
    async findMembersFromClub(@Param('clubId') clubId: string) {
        return await this.socioClubService.findMembersFromClub(clubId);
    }

    @Get(':socioId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.socioClubService.findMemberFromClub(clubId, socioId);
    }

    @Put()
    async updateMembersFromClub(@Param('clubId') clubId: string, @Body() members: any[]) {
        return await this.socioClubService.updateMembersFromClub(clubId, members);
    }

    @Delete(':socioId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.socioClubService.deleteMemberFromClub(clubId, socioId);
    }
}
