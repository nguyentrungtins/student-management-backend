import { Class } from './class.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  id_class: Class;

  @Prop()
  time_learn_date: number;

  @Prop()
  time_learn_lesson: string;

  @Prop()
  time_exam_date: string;

  @Prop()
  time_exam_lesson: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
