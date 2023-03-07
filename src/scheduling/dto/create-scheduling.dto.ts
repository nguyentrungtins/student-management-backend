import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSchedulingDto {
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
