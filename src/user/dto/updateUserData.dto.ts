/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDataDTO {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  id_user: string;
  @IsNotEmpty()
  img: string;
  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  phone: number;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  birth_day: string;
}
