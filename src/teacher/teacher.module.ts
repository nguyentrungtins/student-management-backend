import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectSchema, TeacherSchema } from 'src/untils/schemas';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
