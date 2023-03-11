import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassSchema,
  ScoreSchema,
  StudentRegisterSchema,
  SubjectSchema,
} from 'src/utils/schemas';
import { MarjorSchema } from 'src/utils/schemas/marjor.schema';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }]),
    MongooseModule.forFeature([
      { name: 'StudentRegister', schema: StudentRegisterSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'Marjor', schema: MarjorSchema }]),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
