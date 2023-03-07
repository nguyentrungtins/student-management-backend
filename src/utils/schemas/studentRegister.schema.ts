import { Class } from './class.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class StudentRegister {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  id_class: Class;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  id_user: User;
}

export const StudentRegisterSchema =
  SchemaFactory.createForClass(StudentRegister);
