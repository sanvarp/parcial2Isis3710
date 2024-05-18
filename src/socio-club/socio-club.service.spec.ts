/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { SocioClubService } from './socio-club.service';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let socioList: SocioEntity[];
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await socioRepository.clear();
    await clubRepository.clear();

    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombreDeUsuario: faker.internet.userName(),
        correoElectronico: faker.internet.email(),
        fechaDeNacimiento: faker.date.past(),
        clubes: []
      });
      socioList.push(socio);
    }

    clubList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await clubRepository.save({
        nombre: faker.lorem.sentence(),
        fechaDeFundacion: faker.date.past(),
        descripcion: faker.lorem.sentence(10),
        imagen: faker.image.url(),
        socios: []
      });
      clubList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a member to a club', async () => {
    const club: ClubEntity = clubList[0];
    const socio: SocioEntity = socioList[0];

    const updatedClub: ClubEntity = await service.addMemberToClub(club.id, socio.id);

    expect(updatedClub.socios).toHaveLength(1);
    expect(updatedClub.socios[0].id).toEqual(socio.id);
  });

  it('addMemberToClub should throw an exception if club or member not found', async () => {
    const socio: SocioEntity = socioList[0];

    await expect(service.addMemberToClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
    await expect(service.addMemberToClub(clubList[0].id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('findMembersFromClub should return all members from a club', async () => {
    const club: ClubEntity = clubList[0];
    const socio: SocioEntity = socioList[0];

    await service.addMemberToClub(club.id, socio.id);
    const members: SocioEntity[] = await service.findMembersFromClub(club.id);

    expect(members).toHaveLength(1);
    expect(members[0].id).toEqual(socio.id);
  });

  it('findMembersFromClub should throw an exception if club not found', async () => {
    await expect(service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMemberFromClub should return a member from a club', async () => {
    const club: ClubEntity = clubList[0];
    const socio: SocioEntity = socioList[0];

    await service.addMemberToClub(club.id, socio.id);
    const foundSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id);

    expect(foundSocio).toBeDefined();
    expect(foundSocio.id).toEqual(socio.id);
  });

  it('findMemberFromClub should throw an exception if member not in club', async () => {
    const club: ClubEntity = clubList[0];
    const socio: SocioEntity = socioList[0];

    await service.addMemberToClub(club.id, socio.id);
    await expect(service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The member with the given id is not found in the club");
  });

  it('updateMembersFromClub should update members in a club', async () => {
    const club: ClubEntity = clubList[0];
    const socio: SocioEntity = socioList[0];
    const socio2: SocioEntity = socioList[1];

    await service.addMemberToClub(club.id, socio.id);
    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [socio2]);

    expect(updatedClub.socios).toHaveLength(1);
    expect(updatedClub.socios[0].id).toEqual(socio2.id);
  });

  it('updateMembersFromClub should throw an exception if club not found', async () => {
    await expect(service.updateMembersFromClub("0", socioList)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('deleteMemberFromClub should remove a member from a club', async () => {
    const club: ClubEntity = clubList[0];
    const socio: SocioEntity = socioList[0];

    await service.addMemberToClub(club.id, socio.id);
    const updatedClub: ClubEntity = await service.deleteMemberFromClub(club.id, socio.id);

    expect(updatedClub.socios).toHaveLength(0);
  });

  it('deleteMemberFromClub should throw an exception if club not found', async () => {
    const socio: SocioEntity = socioList[0];
    await expect(service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
});
