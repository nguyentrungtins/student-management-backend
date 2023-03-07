import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
export class Scheduling {
  @IsString()
  @IsDefined()
  id_class: string;
  @IsNumber()
  @IsOptional()
  shift: number;
  @IsString()
  @IsOptional()
  weekday: string;
}
