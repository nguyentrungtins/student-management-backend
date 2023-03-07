import { Body, Injectable } from '@nestjs/common';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Schedule } from 'src/utils/schemas';
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
        course: class_name,
        duration: 1,
        professor: teacherID,
        groups: mongo_class_id.toString(),
      };
      return classList;
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
      const { _id: groupID, class_name } = item;

      const groupList = {
        name: class_name,
        id: groupID.toString(),
      };
      return groupList;
    });
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
      return teacherList;
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
    const dataInput = {
      class: dataClass,
      prof: dataTeacher,
      room: dataRoom,
      group: dataGroup,
      course: dataSubject,
    };

    console.log(dataInput);
    return JSON.stringify(dataInput);
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
