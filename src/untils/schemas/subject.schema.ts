import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from './class.schema';

@Schema()
export class Subject {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  id_subject: Class;

  @Prop()
  subject_name: string;

  @Prop()
  credit: number;

  @Prop()
  learn: number;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
