import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class SubjectDTO {
  @IsNotEmpty()
  @IsString()
  id_subject: string;
  @IsNotEmpty()
  @IsString()
  subject_name: string;
  @IsNotEmpty()
  @IsNumber()
  credit: number;
  @IsNotEmpty()
  @IsNumber()
  learn: number;
}
