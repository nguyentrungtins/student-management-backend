import { IsNotEmpty } from 'class-validator';
export class TeacherDTO {
  id?: string;
  @IsNotEmpty()
  id_teacher: string;
  @IsNotEmpty()
  degree: string;
  @IsNotEmpty()
  teacher_name: string;
  @IsNotEmpty()
  teacher_age: number;
  @IsNotEmpty()
  teacher_address: string;
  @IsNotEmpty()
  teacher_phone: string;
  @IsNotEmpty()
  teacher_email: string;
}
