import { UserData } from './userData.schema';
import { Subject } from './subject.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Score {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  id_user: User;

  @Prop()
  score: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  id_subject: Subject;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
