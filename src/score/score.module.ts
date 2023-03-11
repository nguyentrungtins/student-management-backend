import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema, ScoreSchema, SubjectSchema, UserSchema } from 'src/utils/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }]),
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
  ],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
