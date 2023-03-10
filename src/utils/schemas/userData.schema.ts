/* eslint-disable prettier/prettier */
import { User } from './user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class UserData {
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // id_user: User;

  @Prop()
  id_student: string; // mã sinh viên: ví dụ B180xxxx

  @Prop()
  img: string; // link ảnh đại diện

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  birth_date: string;

  @Prop()
  major: string;
}

export const UserDataSchema = SchemaFactory.createForClass(UserData);
