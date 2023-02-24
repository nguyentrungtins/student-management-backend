import { UserData } from './userData.schema';
import { Subject } from './subject.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Score {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' })
  id_user: UserData;

  @Prop()
  score: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  id_subject: Subject;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
