import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectSchema } from 'src/untils/schemas';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
