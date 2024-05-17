/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn,ManyToMany } from 'typeorm';
import { SocioEntity } from "../socio/socio.entity";
@Entity()
export class ClubEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;

 @Column()
 fechaDeFundacion: Date;

 @Column({ length: 100 })
 descripcion: string;

 @Column()
 imagen: string;

 @ManyToMany(() => SocioEntity, socio => socio.clubes)
 socios: SocioEntity[];
}