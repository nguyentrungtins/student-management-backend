/* eslint-disable prettier/prettier */
import { UserData } from './userData.schema';
import { Role } from './role.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' })
  id_user: UserData; // id liên kết với user data

  @Prop()
  user_name: string;

  @Prop()
  pass_word: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  id_role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
