import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Marjor {
  @Prop()
  id_marjor: string;
  @Prop()
  name_marjor: string;
}

export const MarjorSchema = SchemaFactory.createForClass(Marjor);
