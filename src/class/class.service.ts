import { RegisterClassService } from './../register-class/register-class.service';
import { StudentRegister } from './../untils/schemas/studentRegister.schema';
import { Teacher } from './../untils/schemas/teacher.schema';
import { Room } from './../untils/schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Class, Subject } from 'src/untils/schemas';
import { Model } from 'mongoose';
import { ClassDTO } from './dto/class.dto';
import { UpdateClassDTO } from './dto/updateClass.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('StudentRegister')
    private readonly studentRegister: Model<StudentRegister>,
    private readonly registerClassService: RegisterClassService,
  ) {}

  async addClass(newClass: ClassDTO) {
    const class1 = new this.classModel({
      id_class: newClass.id_class,
      id_subject: newClass.id_subject,
      id_teacher: newClass.id_teacher,
      id_room: newClass.id_room,
      limit_student: newClass.limit_student,
      current_student: newClass.current_student,
      class_name: newClass.class_name,
    });

    await class1.save();
    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;
  }

  async updateClass(updateClass: UpdateClassDTO) {
    const class1 = await this.classModel.findById(updateClass.id);

    await class1.updateOne({
      $set: {
        id_class: updateClass.id_class,
        id_subject: updateClass.id_subject,
        id_teacher: updateClass.id_teacher,
        id_room: updateClass.id_room,
        limit_student: updateClass.limit_student,
        current_student: updateClass.current_student,
        class_name: updateClass.class_name,
      },
    });

    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;
  }

  async deleteClass(id: any) {
    await this.classModel.findByIdAndDelete(id.id_class);
    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;
  }

  //get thông tin taasst cả lớp học để đăng kí
  async getClass(query, user: any) {
    const allClass = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');

    // page 1 , limit 10 => 0 - 9
    // page 2, limit 10 => 10 - 19
    // tổng page được chia ra
    //console.log(query, pageTotal)
    const filterInClass = await Promise.all(
      allClass.map(async (data) => {
        const id = {
          id_user: user.id_user,
          id_class: allClass[0]._id,
        };
        const is = await this.isInClass(id);
        return { data, inClass: is };
      }),
    );
    // lọc kết quả theo yêu cầu hiểu thị
    //console.log(query.select)
    const filterSelect = filterInClass.filter((data) => {
      if (query.select == 'all' || query.select == null) {
        return data;
      }
      if (query.select == 'dadangki') {
        if (data.inClass == true) return data;
      }
      if (query.select == 'chuadangki') {
        if (data.inClass == false) return data;
      }
    });

    const pageTotal = Math.ceil(filterSelect.length / query.limit);
    const dataStart = (query.page - 1) * query.limit;
    const dataEnd = dataStart + query.limit;

    if (pageTotal == query.page) {
      console.log(query.page);
      // lọc kết quả theo kết quả có đki hay không

      const classData = filterSelect.slice(dataStart, filterSelect.length);
      //console.log(filterSelect[0])
      const result = {
        totalClass: allClass.length,
        page_total: pageTotal,
        page: query.page,
        limit: query.limit,
        class: classData,
      };

      return result;
    } else {
      // lọc kết quả theo kết quả có đki hay không
      console.log(pageTotal)
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

  // Đăng kí vào 1 lớp id_class với id_user
  async registerClass() {
    return 'register class';
  }
  // kiểm tra xem sinh viên có id đã đăng kí lớp có id_class
  async isInClass(id: any) {
    return this.registerClassService.isUserInClass(id);
  }
}
