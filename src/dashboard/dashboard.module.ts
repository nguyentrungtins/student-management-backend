import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassSchema,
  RoomSchema,
  ScheduleSchema,
  StudentRegisterSchema,
  SubjectSchema,
  TeacherSchema,
  User,
  UserDataSchema,
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
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
