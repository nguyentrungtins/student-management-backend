import { IsNotEmpty } from 'class-validator';
export class ClassDTO {
  id?: string;
  @IsNotEmpty()
  class_name: string;
  @IsNotEmpty()
  id_class: string;
  @IsNotEmpty()
  id_subject: string;
  @IsNotEmpty()
  id_teacher: string;
  @IsNotEmpty()
  id_room: string;
  @IsNotEmpty()
  limit_student: string;
  @IsNotEmpty()
  current_student: string;
}
