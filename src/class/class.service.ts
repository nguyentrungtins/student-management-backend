import { Score, User } from 'src/utils/schemas';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Teacher } from './../utils/schemas/teacher.schema';
import { Room } from './../utils/schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Class, StudentRegister, Subject } from 'src/utils/schemas';
import { Model } from 'mongoose';
import { ClassDTO } from './dto/class.dto';
import { RegisterClassService } from 'src/register-class/register-class.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Score') private readonly scoreModel: Model<Score>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('StudentRegister')
    private readonly studentRegisterModel: Model<StudentRegister>,
    private readonly registerClassService: RegisterClassService,
  ) {}

  async addClass(newClass: ClassDTO) {
    console.log(newClass);
    const subject = await this.subjectModel.find({
      id_subject: newClass.id_subject.toUpperCase(),
    });
    const teacher = await this.teacherModel.find({
      id_teacher: newClass.id_teacher.toUpperCase(),
    });
    const room = await this.roomModel.find({
      id_room: newClass.id_room.toUpperCase(),
    });

    if (
      subject.length == 0 ||
      teacher.length == 0 ||
      room.length == 0 ||
      newClass.limit_student == 0
    ) {
      throw new UnauthorizedException('Error!');
    } else {
      const class1 = new this.classModel({
        id_class: newClass.id_class.toUpperCase(),
        id_subject: subject[0]._id,
        id_teacher: teacher[0]._id,
        id_room: room[0]._id,
        limit_student: newClass.limit_student,
        current_student: newClass.current_student,
        class_name: newClass.class_name,
      });
      await class1.save();

      return 'Success!';
    }
  }

  async updateClass(updateClass: ClassDTO, filterQuery) {
    const class1 = await this.classModel.findById(updateClass.id);
    //console.log(updateClass)
    const subject = await this.subjectModel.find({
      id_subject: updateClass.id_subject.toUpperCase(),
    });
    const teacher = await this.teacherModel.find({
      id_teacher: updateClass.id_teacher.toUpperCase(),
    });
    const room = await this.roomModel.find({
      id_room: updateClass.id_room.toUpperCase(),
    });
    if (
      subject.length == 0 ||
      teacher.length == 0 ||
      room.length == 0 ||
      updateClass.limit_student == 0
    ) {
      throw new UnauthorizedException('Error!');
    } else {
      await class1.updateOne({
        $set: {
          id_class: updateClass.id_class,
          id_subject: subject[0]._id,
          id_teacher: teacher[0]._id,
          id_room: room[0]._id,
          limit_student: updateClass.limit_student,
          current_student: updateClass.current_student,
          class_name: updateClass.class_name,
        },
      });

      const result = await this.getClassAdmin(filterQuery);
      return result;
    }
  }

  async deleteClass(id: any) {
    /*await this.classModel.findByIdAndDelete(id.id_class);
    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;*/
    const _class = await this.classModel.findById(id.id_class);

    if (_class.status) {
      throw new UnauthorizedException('Fail!');
    } else {
      await this.classModel.findByIdAndDelete(id.id_class);
      await this.studentRegisterModel.deleteMany({
        id_class: id.id_class,
      });
      return 'Success';
    }
  }

  async resetClass(id: any, filterQuery: any) {
    await this.studentRegisterModel.deleteMany({
      id_class: id.id,
    });

    await this.classModel.findByIdAndUpdate(id.id, {
      $set: {
        current_student: 0,
        status: false,
      },
    });
    const result = await this.getClassAdmin(filterQuery);

    //console.log(id, filterQuery);
    return result;
  }
  //get thông tin taasst cả lớp học để đăng kí
  async getClass(query, user: any) {
    const data = await this.userModel
      .findById(user.user_id)
      .populate('id_user');

    const _marjor = data.id_user.major;
    const _allClass = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');

    const allClass = await _allClass.filter((item) => {
      if (item.id_subject.marjor_learn.includes(_marjor)) return item;
    });

    const filterInClass = await Promise.all(
      allClass.map(async (data) => {
        const id = {
          id_user: user.user_id,
          id_class: data._id,
        };
        let is = await this.isInClass(id);

        return { data, inClass: is };
      }),
    );
    const filterSelect = filterInClass.filter((data) => {
      if (query.select == 'all' || query.select == null) {
        if (data.data.id_subject.subject_name.includes(query.search))
          return data;
      }
      if (query.select == 'dadangki') {
        if (
          data.inClass == true &&
          data.data.id_subject.subject_name.includes(query.search)
        )
          return data;
      }
      if (
        query.select == 'chuadangki' &&
        data.data.id_subject.subject_name.includes(query.search)
      ) {
        if (data.inClass == false) return data;
      }
    });
    //console.log(filterSelect)
    const pageTotal = Math.ceil(filterSelect.length / query.limit);
    const dataStart = (query.page - 1) * query.limit;
    const dataEnd = dataStart + query.limit;

    if (pageTotal == query.page) {
      //console.log(query.page);
      // lọc kết quả theo kết quả có đki hay không

      const classData = filterSelect.slice(dataStart, filterSelect.length);
      //console.log(classData)
      const result = {
        totalClass: allClass.length,
        page_total: pageTotal,
        page: query.page,
        limit: query.limit,
        class: classData,
      };

      return result;
    } else {
      const classData = filterSelect.slice(dataStart, dataEnd);
      //console.log(filterSelect[0])

      const result = {
        totalClass: allClass.length,
        page_total: pageTotal,
        page: query.page,
        limit: query.limit,
        class: classData,
      };

      return result;
    }
  }

  async getClassAdmin(filterQuery: any) {
    const allClass = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');

    const allRoom = await this.roomModel.find();

    const filterSearch = allClass.filter((class1) => {
      //console.log('Quản trị hệ thống'.includes(filterQuery.search));
      if (class1.class_name.includes(filterQuery.search)) return class1;
    });

    const pageTotal = Math.ceil(filterSearch.length / filterQuery.limit);
    const dataStart = (filterQuery.page - 1) * filterQuery.limit;
    const dataEnd = dataStart + filterQuery.limit;

    if (pageTotal == filterQuery.page) {
      //console.log(query.page);
      // lọc kết quả theo kết quả có đki hay không
      const newFilterSearch = filterSearch.reverse();
      const classData = newFilterSearch.slice(dataStart, filterSearch.length);
      //console.log(filterSelect[0])
      const result = {
        totalSubject: allClass.length,
        page_total: pageTotal,
        class: classData,
        room: allRoom,
      };

      return result;
    } else {
      // lọc kết quả theo kết quả có đki hay không
      // console.log(pageTotal)
      const newFilterSearch = filterSearch.reverse();

      const classData = newFilterSearch.slice(dataStart, dataEnd);
      //console.log(filterSelect[0])
      const result = {
        totalSubject: allClass.length,
        page_total: pageTotal,
        class: classData,
        room: allRoom,
      };

      return result;
    }
  }
  // Đăng kí vào 1 lớp id_class với id_user
  async registerClass(information, user: any) {
    if (information.sign == 'signin') {
      // tìm xem cái ID môn học cần đăng kí là gì
      const _class = await this.classModel
        .findById(information.id_class)
        .populate('id_subject');
      const _idSubject = _class.id_subject;
      // Tìm xem đã đăng kí môn đó hay chưa

      const abc = await this.studentRegisterModel
        .find({
          id_user: user.user_id,
        })
        .populate('id_class');

      const _check = abc.some(
        (item) =>
          item.id_class.id_subject.toString() == _idSubject._id.toString(),
      );

      // tìm kiếm thông tin trong bảng score
      const _score = await this.scoreModel.find({
        id_user: user.user_id,
        id_subject: _idSubject._id,
      });

      if (!_check && _score.length == 0) {
        const new_user_class = new this.studentRegisterModel({
          id_user: user.user_id,
          id_class: information.id_class,
        });
        await new_user_class.save();
        const new_score = new this.scoreModel({
          id_user: user.user_id,
          id_class: information.id_class,
          id_subject: information.id_subject,
          score: null,
        });

        //console.log(new_score)
        await new_score.save();

        const update = await this.classModel.findById(information.id_class);
        const number = update.current_student;
        await update.updateOne({
          $set: {
            current_student: number + 1,
          },
        });
        const result = await this.getClass(information.query, user);
        return result;
      } else {
        throw new UnauthorizedException('Fails!');
      }
      //console.log(_idSubject._id);
      /*const new_user_class = new this.studentRegisterModel({
        id_user: user.user_id,
        id_class: information.id_class,
      });
      await new_user_class.save();

      console.log(information);

      const new_score = new this.scoreModel({
        id_user: user.user_id,
        id_class: information.id_class,
        id_subject: information.id_subject,
        score: 99,
      });

      //console.log(new_score)
      await new_score.save();

      const update = await this.classModel.findById(information.id_class);
      const number = update.current_student;
      await update.updateOne({
        $set: {
          current_student: number + 1,
        },
      });
      const result = await this.getClass(information.query, user);
      return result;*/
    }
    if (information.sign == 'signout') {
      await this.studentRegisterModel.findOneAndDelete({
        id_user: user.user_id,
        id_subject: information.id_subject,
        id_class: information.id_class,
      });

      await this.scoreModel.findOneAndDelete({
        id_user: user.user_id,
        id_class: information.id_class,
      });
      //console.log(information.id_class)
      const update = await this.classModel.findById(information.id_class);
      const number = update.current_student;

      if (number > 0) {
        await update.updateOne({
          $set: {
            current_student: number + -1,
          },
        });
      }
      const result = await this.getClass(information.query, user);
      return result;
      //return "1";
    }
    return null;
  }

  // kiểm tra xem sinh viên có id đã đăng kí lớp có id_class
  async isInClass(id: any) {
    return this.registerClassService.isUserInClass(id);
  }
}
