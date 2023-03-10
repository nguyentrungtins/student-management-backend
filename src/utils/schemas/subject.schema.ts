/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop([String])
  marjor_learn: string[]; //  ngành học môn này

  @Prop({ default: false })
  lab_required: boolean; // có yêu cầu về thực hành không
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
