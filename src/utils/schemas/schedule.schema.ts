import { Class } from './class.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  id_class: Class;

  @Prop()
  shift: number;

  @Prop()
  weekday: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
