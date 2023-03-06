import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Room {
  @Prop()
  id_room: string;

  @Prop()
  name_room: string;

  @Prop()
  lab: boolean; // có máy tính để thực hành hay không

  @Prop()
  seats: number; // chỗ chứa
}

export const RoomSchema = SchemaFactory.createForClass(Room);
