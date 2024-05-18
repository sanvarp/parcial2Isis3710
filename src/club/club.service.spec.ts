/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    clubList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        fechaDeFundacion: faker.date.past(),
        descripcion: faker.lorem.sentence(10),
        imagen: faker.image.url()
      });
      clubList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.lorem.sentence(),
      fechaDeFundacion: faker.date.future(),
      descripcion: faker.lorem.sentence(10),
      imagen: faker.image.url(),
      socios: [] // Inicializa 'socios' como un arreglo vacío
    };

    const newClub: ClubEntity = await service.create(club);

    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: { id: newClub.id } });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre);
    expect(storedClub.descripcion).toEqual(newClub.descripcion);
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })

    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('update should return an updated club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = "NuevoNombre";

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: {id: club.id} });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre);
  });

  it('update should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = "NuevoNombre";

    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  it('findOne should return a club by id', async () => {
    const club: ClubEntity = clubList[0];
    const storedClub: ClubEntity = await service.findOne(club.id);
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
});
