import * as axios from 'axios';
import { Body, Injectable, ForbiddenException } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Schedule } from 'src/utils/schemas';
import { map, catchError, lastValueFrom, async } from 'rxjs';
import { Model } from 'mongoose';
import {
  Teacher,
  Room,
  Class,
  StudentRegister,
  Subject,
} from 'src/utils/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterClassModule } from './../register-class/register-class.module';
import { RegisterClassService } from 'src/register-class/register-class.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { response } from 'express';
@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel('Schedule') private readonly scheduleModel: Model<Schedule>,
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('StudentRegister')
    private readonly studentRegisterModel: Model<StudentRegister>,
    private readonly registerClassService: RegisterClassService,
    private readonly httpService: HttpService,
  ) {}
  async create(body: CreateSchedulingDto): Promise<Schedule> {
    const _scheduleData = new this.scheduleModel({
      ...body,
    });
    await _scheduleData.save();
    return _scheduleData;
  }

  async findAll(): Promise<Schedule[]> {
    const _schedule = await this.scheduleModel.find();
    return _schedule;
  }

  async schedulingTimeTable(major: string) {
    const _subject = await this.subjectModel.find({ marjor_learn: major });

    const _class = await this.classModel
      .find({ status: false })
      // .populate('id_subject')
      .populate({ path: 'id_subject', match: { marjor_learn: major } })
      .populate('id_teacher')
      .populate('id_room');
    const idList = _class.map((item) => {
      return item._id;
    });
    const _studentRegister = await this.studentRegisterModel.find({
      id_class: { $in: idList },
    });

    const inputFinal = [];
    let dataTeacher = _class.map((item) => {
      if (
        item.id_teacher == null ||
        item.id_subject == null ||
        item.id_room == null
      ) {
        return;
      }
      const { id_teacher } = item;

      const { teacher_name, id_teacher: teacherID } = id_teacher;

      const teacherList = {
        name: teacher_name,
        id: teacherID,
      };
      inputFinal.push({ prof: teacherList });
      return teacherList;
    });
    let dataSubject = _class.map((item) => {
      if (
        item.id_teacher == null ||
        item.id_subject == null ||
        item.id_room == null
      ) {
        return;
      }
      const { class_name, id_subject } = item;
      const { id_subject: subjectID, subject_name } = id_subject;
      const subjectList = {
        name: subject_name,
        id: id_subject.id_subject.toString(),
      };

      inputFinal.push({ course: subjectList });
      return subjectList;
    });
    let dataRoom = _class.map((item) => {
      const { id_room } = item;

      const { name_room, seats, lab } = id_room;

      const roomList = {
        name: name_room,
        lab,
        size: seats,
      };
      inputFinal.push({ room: roomList });
      return roomList;
    });
    let dataGroup = _class.map((item) => {
      if (
        item.id_teacher == null ||
        item.id_subject == null ||
        item.id_room == null
      ) {
        return;
      }
      const { _id: groupID, class_name, limit_student } = item;

      const groupList = {
        name: class_name,
        id: groupID.toString(),
        size: limit_student,
      };
      inputFinal.push({ group: groupList });
      return groupList;
    });

    let dataClass = _class.map((item) => {
      if (
        item.id_teacher == null ||
        item.id_subject == null ||
        item.id_room == null
      ) {
        return;
      }
      const {
        id_class: classID,
        _id: mongo_class_id,
        class_name,
        id_teacher,
        id_subject,
      } = item;

      const { id_teacher: teacherID } = id_teacher;
      const classList = {
        id: mongo_class_id.toString(),
        course: id_subject.id_subject.toString(),
        duration: 1,
        professor: teacherID,
        groups: mongo_class_id.toString(),
      };
      inputFinal.push({ class: classList });
      return classList;
    });

    function filterData(a) {
      const seen = {};

      a = a.filter((item) => item != undefined);
      a = a.filter((c, index) => {
        return a.indexOf(c) === index;
      });
      a = a.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.place === value.place && t.name === value.name,
          ),
      );
      return a;
    }
    dataSubject = filterData(dataSubject);
    dataClass = filterData(dataClass);
    dataTeacher = filterData(dataTeacher);
    dataRoom = filterData(dataRoom);
    dataGroup = filterData(dataGroup);
    dataGroup = filterData(dataGroup);
    const dataInput = {
      class: dataClass,
      prof: dataTeacher,
      room: dataRoom,
      group: dataGroup,
      course: dataSubject,
    };
    const tmpData = {
      username: 'abc',
      password: '123456',
    };
    // tmpData = JSON.stringify(tmpData);
    const request = this.httpService
      .post('http://127.0.0.1:5000/scheduling', inputFinal)
      .pipe(map((res) => res.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );

    const dataRes = await lastValueFrom(request);
    dataRes.map(async (classItem) => {
      console.log(classItem);
      const scheduleData = new this.scheduleModel({
        id_class: classItem.classID,
        shift_weekday_room: classItem.shift_weekday_room,
      });
      const filter = { _id: classItem.classID };
      const update = { status: true };

      // `doc` is the document _before_ `update` was applied
      const _schedule = await this.scheduleModel.find({
        id_class: classItem.classID,
      });
      if (_schedule.length == 0) {
        await scheduleData.save();
        const doc = await this.classModel.findOneAndUpdate(filter, update);
      }
    });

    return JSON.stringify(dataRes);
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduling`;
  }

  update(id: number, updateSchedulingDto: UpdateSchedulingDto) {
    return `This action updates a #${id} scheduling`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduling`;
  }
}
