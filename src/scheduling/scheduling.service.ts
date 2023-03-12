/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
import { Body, Injectable, ForbiddenException } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Schedule, User, UserData } from 'src/utils/schemas';
import { map, catchError, lastValueFrom, async } from 'rxjs';
import { Model } from 'mongoose';
import { Class, StudentRegister, Subject } from 'src/utils/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Marjor } from 'src/utils/schemas/marjor.schema';
import { getMonth, getYear, monthsToQuarters, startOfToday } from 'date-fns';
@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel('Schedule') private readonly scheduleModel: Model<Schedule>,
    @InjectModel('Marjor') private readonly majorModel: Model<Marjor>,
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('UserData') private readonly userDataModel: Model<UserData>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('StudentRegister')
    private readonly studentRegisterModel: Model<StudentRegister>,
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

  async findAllMajor(): Promise<any> {
    const _class = await this.classModel
      .find({ status: false })
      .populate('id_subject');
    console.log(_class);
    const major = _class.map((c) => {
      return c.id_subject.marjor_learn;
    });
    let majorList = [];
    major.map((c) => {
      c.map((i) => {
        majorList.push(i);
      });
    });

    const uniq = [...new Set(majorList)];
    console.log(uniq);
    const majorData = await this.majorModel.find({ id_marjor: { $in: uniq } });

    // const majors = await this.majorModel.find();
    // return majors;
    return majorData;
  }

  async schedulingTimeTable(major: string) {
    const _class = await this.classModel
      .find({ status: false })
      // .populate('id_subject')
      .populate({ path: 'id_subject', match: { marjor_learn: major } })
      .populate('id_teacher')
      .populate('id_room');

    const inputFinal = [];
    const dataTeacher = _class.map((item) => {
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
    const dataSubject = _class.map((item) => {
      if (
        item.id_teacher == null ||
        item.id_subject == null ||
        item.id_room == null
      ) {
        return;
      }
      const { id_subject } = item;
      const { subject_name } = id_subject;
      const subjectList = {
        name: subject_name,
        id: id_subject.id_subject.toString(),
      };

      inputFinal.push({ course: subjectList });
      return subjectList;
    });
    const dataRoom = _class.map((item) => {
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
    const dataGroup = _class.map((item) => {
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

    const dataClass = _class.map((item) => {
      if (
        item.id_teacher == null ||
        item.id_subject == null ||
        item.id_room == null
      ) {
        return;
      }
      const { _id: mongo_class_id, id_teacher, id_subject } = item;

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
    const request = this.httpService
      .post('http://127.0.0.1:5000/scheduling', inputFinal)
      .pipe(map((res) => res.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );

    const dataRes = await lastValueFrom(request);
    const today = startOfToday();
    const month = getMonth(today);
    const quarter = monthsToQuarters(month);
    const year = getYear(today).toString();
    let semester = { semester: 'HK1', year: '2023' };
    if (quarter == 1) {
      semester = { semester: 'HK1', year: year };
    } else {
      semester = { semester: 'HK2', year: year };
    }

    dataRes.map(async (classItem) => {
      console.log(classItem);
      const scheduleData = new this.scheduleModel({
        id_class: classItem.classID,
        class_name: classItem.className,
        shift_weekday_room: classItem.shift_weekday_room,
        semester: semester,
      });
      const filter = { _id: classItem.classID };
      const update = { status: true };

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

  async findOne(id: string): Promise<Schedule[]> {
    const _classRegister = await this.studentRegisterModel.find({
      id_user: id,
    });
    const _classList = [];
    _classRegister.map((item) => {
      const { id_class } = item;
      _classList.push(id_class);
    });
    const _schedule = await this.scheduleModel.find({
      id_class: { $in: _classList },
    });
    return _schedule;
  }

  update(id: number, updateSchedulingDto: UpdateSchedulingDto) {
    return `This action updates a #${id} scheduling`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduling`;
  }
}
