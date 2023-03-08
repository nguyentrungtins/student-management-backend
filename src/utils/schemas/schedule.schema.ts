import { Class } from './class.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { type } from 'os';

interface scheduleInterface {
  shift: string;
  weekday: string;
  room: string;
}
@Schema()
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  id_class: Class;

  @Prop()
  shift_weekday_room: Array<scheduleInterface>;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
