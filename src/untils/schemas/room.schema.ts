import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from './class.schema';

@Schema()
export class Room {
  @Prop()
  id_room: string;

  @Prop()
  name_room: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
