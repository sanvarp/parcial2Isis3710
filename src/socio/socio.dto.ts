/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsEmail, IsDateString, IsUUID } from 'class-validator';

export class SocioDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly nombreDeUsuario: string;

  @IsEmail()
  @IsNotEmpty()
  readonly correoElectronico: string;

  @IsDateString()
  @IsNotEmpty()
  readonly fechaDeNacimiento: Date;

}
