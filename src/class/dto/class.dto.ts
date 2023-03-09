import { IsNotEmpty, IsString, Matches, IsInt } from 'class-validator';
export class ClassDTO {
  id?: string;
  _id?: string;
  @IsNotEmpty()
  class_name: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^ID[0-9]{3}$/)
  id_class: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]{2}[0-9]{3}$/)
  id_subject: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^S[0-9]{3}$/)
  id_teacher: string;
  @IsNotEmpty()
  @IsString()
  id_room: string;
  @IsNotEmpty()
  //@IsInt()
  limit_student: number;
  @IsNotEmpty()
  @IsInt()
  current_student: number;
}
