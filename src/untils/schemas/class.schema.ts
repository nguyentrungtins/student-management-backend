import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Subject } from './subject.schema';

@Schema()
export class Class {
  @Prop()
  id_class: string;

  @Prop()
  class_name: string;

  @Prop()
  number_student: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  id_subject: Subject;

  @Prop()
  id_teacher: string;

  @Prop()
  id_room: string;

  @Prop()
  limit_student: number;

  @Prop()
  current_student: number;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
