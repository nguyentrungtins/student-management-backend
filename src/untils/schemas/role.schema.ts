import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
//export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Role {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  id_role: User;

  @Prop()
  name_role: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
