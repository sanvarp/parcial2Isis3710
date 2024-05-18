/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombreDeUsuario: faker.internet.userName(),
        correoElectronico: faker.internet.email(),
        fechaDeNacimiento: faker.date.past()
      });
      socioList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombreDeUsuario: faker.internet.userName(),
      correoElectronico: faker.internet.email(),
      fechaDeNacimiento: faker.date.past(),
      clubes: [] 
    };

    const newSocio: SocioEntity = await service.create(socio);

    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({ where: { id: newSocio.id } });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreDeUsuario).toEqual(newSocio.nombreDeUsuario);
    expect(storedSocio.correoElectronico).toEqual(newSocio.correoElectronico);
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })

    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('update should return an updated socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.nombreDeUsuario = "NuevoUsuario";

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({ where: {id: socio.id} });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreDeUsuario).toEqual(socio.nombreDeUsuario);
  });

  it('update should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.nombreDeUsuario = "NuevoUsuario";

    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne should return a socio by id', async () => {
    const socio: SocioEntity = socioList[0];
    const storedSocio: SocioEntity = await service.findOne(socio.id);
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreDeUsuario).toEqual(socio.nombreDeUsuario);
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });
});
