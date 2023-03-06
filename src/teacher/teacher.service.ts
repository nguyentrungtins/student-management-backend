/* eslint-disable prettier/prettier */
import { UpdateTeacherDTO } from './dto/updateTeacher.dto';
import { TeacherDTO } from './dto/teacher.dto';
import { Teacher } from './../untils/schemas/teacher.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from 'src/untils/schemas';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
  ) {}
  // thêm giáo viên mới
  async addTeacher(newTeacher: TeacherDTO) {
    const newT = new this.teacherModel({
      id_teacher: newTeacher.id_teacher,
      degree: newTeacher.degree,
      teacher_name: newTeacher.teacher_name,
      teacher_age: newTeacher.teacher_age,
      teacher_address: newTeacher.teacher_address,
      teacher_phone: newTeacher.teacher_phone,
      teacher_email: newTeacher.teacher_email,
    });

    await newT.save();

    //const result = await this.teacherModel.find().populate('id_subject');
    return 'Success';
  }

  // sửa thông tin giáo viên
  async updateTeacher(updateTeacher: UpdateTeacherDTO, query: any) {
    console.log(updateTeacher);
    const teacher = await this.teacherModel.findById(updateTeacher._id);
    await teacher.updateOne({
      $set: {
        degree: updateTeacher.degree,
        teacher_name: updateTeacher.teacher_name,
        teacher_age: updateTeacher.teacher_age,
        teacher_email: updateTeacher.teacher_email,
        teacher_address: updateTeacher.teacher_address,
        teacher_phone: updateTeacher.teacher_phone,
      },
    });

    //const result = await this.teacherModel.find();
    const result = await this.getAllTeacher(query);
    return result;
  }
  // xóa giáo viên
  async deleteTeacher(id: any) {
    await this.teacherModel.findByIdAndDelete(id.id_teacher);
    const result = await this.teacherModel.find();
    return result;
  }

  async getAllTeacher(filterQuery: any) {
    const allTeacher = await this.teacherModel.find();

    const filterSearch = allTeacher.filter((teacher) => {
      if (teacher.teacher_name.includes(filterQuery.search)) return teacher;
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
        totalSubject: allTeacher.length,
        page_total: pageTotal,
        teacher: classData,
      };

      return result;
    } else {
      // lọc kết quả theo kết quả có đki hay không
      // console.log(pageTotal)
      const newFilterSearch = filterSearch.reverse();

      const classData = newFilterSearch.slice(dataStart, dataEnd);
      //console.log(filterSelect[0])
      const result = {
        totalSubject: allTeacher.length,
        page_total: pageTotal,
        teacher: classData,
      };

      return result;
    }
  }
}
