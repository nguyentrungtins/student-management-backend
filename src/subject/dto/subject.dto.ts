import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
export class SubjectDTO {
  id?: string;
  _id?: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]{2}[0-9]{3}$/)
  id_subject: string;
  @IsNotEmpty()
  @IsString()
  subject_name: string;
  @IsNotEmpty()
  @IsInt()
  credit: number;
  @IsNotEmpty()
  @IsInt()
  learn: number;
  @IsArray()
  @ArrayMinSize(1)
  marjor_learn: [string];
  lab_required?: string;
}
