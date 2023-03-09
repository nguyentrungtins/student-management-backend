import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { ScheduleSchema, User, UserDataSchema } from 'src/utils/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterClassModule } from './../register-class/register-class.module';
import {
  ClassSchema,
  RoomSchema,
  StudentRegisterSchema,
  SubjectSchema,
  TeacherSchema,
} from 'src/utils/schemas';
import { MarjorSchema } from 'src/utils/schemas/marjor.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    MongooseModule.forFeature([{ name: 'Marjor', schema: MarjorSchema }]),
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: User }]),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([
      { name: 'StudentRegister', schema: StudentRegisterSchema },
    ]),
    RegisterClassModule,
    HttpModule,
  ],

  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
