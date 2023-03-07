import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Role {
  @Prop()
  name_role: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
