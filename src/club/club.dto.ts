/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';

export class ClubDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsDateString()
  @IsNotEmpty()
  readonly fechaDeFundacion: Date;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly imagen: string;

  // Similar a SocioDto, las relaciones como 'socios' no se incluyen en el DTO a menos que sea necesario para operaciones específicas
}
