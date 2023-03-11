import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Class,
  Schedule,
  User,
  UserData,
  Subject,
  StudentRegister,
} from 'src/utils/schemas';
import { Marjor } from 'src/utils/schemas/marjor.schema';
import {
  getMonth,
  getYear,
  monthsToQuarters,
  startOfDay,
  startOfToday,
} from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Schedule') private readonly scheduleModel: Model<Schedule>,
    @InjectModel('Marjor') private readonly majorModel: Model<Marjor>,
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('UserData') private readonly userDataModel: Model<UserData>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('StudentRegister')
    private readonly studentRegisterModel: Model<StudentRegister>,
  ) {}
  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  async findDashboardDataClient(id: string) {
    const _classRegister = await this.studentRegisterModel.find({
      id_user: id,
    });
    const _classList = [];
    _classRegister.map((item) => {
      const { id_class } = item;
      _classList.push(id_class);
    });

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
    const _schedule = await this.scheduleModel.find({
      id_class: { $in: _classList },
      semester: semester,
    });
    const _classListHaveSchedule = [];
    _schedule.map((item) => {
      const { id_class } = item;
      _classListHaveSchedule.push(id_class);
    });
    // _schedule.map((s)=> {

    // })
    const _classIncludeStudent = await this.classModel
      .find({ _id: { $in: _classListHaveSchedule } })
      .populate('id_subject')
      // .populate({ path: 'id_subject', match: { marjor_learn: major } })
      .populate('id_teacher')
      .populate('id_room');

    let creditList = 0;
    _classIncludeStudent.map((s) => {
      const { _id: classID, id_subject } = s;
      const { credit } = id_subject;
      creditList = creditList + credit;
    });
    const dataResponse = {
      numClass: _classIncludeStudent.length,
      numCredit: creditList,
    };
    return dataResponse;
  }
  async findDashboardDataAdmin() {
    const majors = await this.majorModel.find();
    const users = await this.userModel.find();
    const dataResponse = {
      numMajor: majors.length,
      numUser: users.length,
    };
    return dataResponse;
    // return `This action removes a #${id} dashboard`;
  }
  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }
}
