import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
export class SubjectDTO {
  id?: string;
  @IsNotEmpty()
  @IsString()
  //@Matches()
  id_subject: string;
  @IsNotEmpty()
  @IsString()
  subject_name: string;
  @IsNotEmpty()
  @IsString()
  credit: number;
  @IsNotEmpty()
  @IsString()
  learn: number;
}
