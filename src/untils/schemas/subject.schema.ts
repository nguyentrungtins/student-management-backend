import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from './class.schema';

@Schema()
export class Subject {

  @Prop()
  id_subject: string; // mã môn học ví dụ: CT102

  @Prop()
  subject_name: string; // tên môn học ví dụ: Lập trình hướng đối tượng

  @Prop()
  credit: number; // số tín chỉ: 3 tín chỉ

  @Prop()
  learn: number; // số tiết học: tuần học 3 tiết
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
