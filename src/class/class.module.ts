import { ScheduleSchema, ScoreSchema, UserSchema } from 'src/utils/schemas';
import { RegisterClassModule } from './../register-class/register-class.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassSchema,
  RoomSchema,
  StudentRegisterSchema,
  SubjectSchema,
  TeacherSchema,
} from 'src/utils/schemas';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }]),
    MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'StudentRegister', schema: StudentRegisterSchema },
    ]),
    RegisterClassModule,
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
