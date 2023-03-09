import { IsEmail, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class TeacherDTO {
  _id?: string;
  id?: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^S[0-9]{3}$/)
  id_teacher: string;
  @IsNotEmpty()
  degree: string;
  @IsNotEmpty()
  teacher_name: string;
  @IsNotEmpty()
  @IsInt()
  teacher_age: number;
  @IsNotEmpty()
  @IsString()
  teacher_address: string;
  @IsNotEmpty()
  teacher_phone: string;
  @IsNotEmpty()
  @IsEmail()
  teacher_email: string;
}
