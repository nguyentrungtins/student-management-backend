import { Subject } from './subject.schema';
import { Class } from './class.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Teacher {
  @Prop()
  id_teacher: string;
  @Prop()
  degree: string;

  @Prop()
  teacher_name: string;

  @Prop()
  teacher_age: number;

  @Prop()
  teacher_address: string;

  @Prop()
  teacher_phone: string;

  @Prop()
  teacher_email: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
