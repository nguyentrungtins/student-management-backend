import { Teacher } from './teacher.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Subject } from './subject.schema';
import { Room } from './room.schema';
import { StudentRegister } from './studentRegister.schema';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister' })
  student_register: StudentRegister;

  @Prop()
  current_student: number;

  @Prop()
  status: string;

  @Prop()
  major_tag: Array<string>;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
