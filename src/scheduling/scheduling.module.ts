import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { Schedule } from 'src/utils/schemas';
import { ScheduleSchema } from 'src/utils/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterClassModule } from './../register-class/register-class.module';
import {
  ClassSchema,
  RoomSchema,
  StudentRegisterSchema,
  SubjectSchema,
  TeacherSchema,
} from 'src/utils/schemas';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([
      { name: 'StudentRegister', schema: StudentRegisterSchema },
    ]),
    RegisterClassModule,
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
