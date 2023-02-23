import { User } from './user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class UserData {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  id_user: User;
  
  @Prop()
  img: string;

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
}

export const UserDataSchema = SchemaFactory.createForClass(UserData);
