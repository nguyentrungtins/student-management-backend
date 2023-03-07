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
<<<<<<< Updated upstream

    const _class = await this.classModel
      // .find({ id_subject: _id }, { status: false })
      .find({ status: false }, { marjor_learn: major })
      .populate('id_subject')
      .populate('id_teacher')
      .populate('id_room');

    return _class;
=======
    const [_id] = _subject;
    const _class = await this.classModel.find(
      { id_subject: _id },
      { status: false },
    );
    return _subject;
>>>>>>> Stashed changes
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
