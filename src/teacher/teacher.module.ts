import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema, ScheduleSchema, SubjectSchema, TeacherSchema } from 'src/utils/schemas';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),

  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
