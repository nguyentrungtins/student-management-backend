import { Teacher } from './teacher.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Subject } from './subject.schema';
import { Room } from './room.schema';

@Schema()
export class Class {
  @Prop()
  class_name: string;

  @Prop()
  id_class: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  id_subject: Subject;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' })
  id_teacher: Teacher;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  id_room: Room;

  @Prop()
  limit_student: number;

  @Prop()
  current_student: number;

  @Prop({ default: false })
  status: boolean;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
