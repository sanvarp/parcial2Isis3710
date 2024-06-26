/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn,ManyToMany} from 'typeorm';
import { ClubEntity } from "../club/club.entity";

@Entity()
export class SocioEntity{
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombreDeUsuario: string;

 @Column()
 correoElectronico: string;

 @Column()
 fechaDeNacimiento: Date;

 @ManyToMany(() => ClubEntity, club => club.socios)
    clubes: ClubEntity[];
}
