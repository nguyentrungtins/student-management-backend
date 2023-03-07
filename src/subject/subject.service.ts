/* eslint-disable prettier/prettier */
import { UpdateSub } from './dto/updateSub.dto';
import { SubjectDTO } from './dto/subject.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Subject } from './../utils/schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
  ) {}
  // thêm 1 môn học vào db
  async addSubject(sub: SubjectDTO, filterQuery: any, user) {
    if (user.role == 'Admin') {
      //console.log(sub)

      const [sub1, sub2] = await this.findSubjectNameAndId(
        sub.subject_name,
        sub.id_subject.toUpperCase(),
      );
      //console.log(sub1.length != 0 || sub2.length != 0);
      if (sub1.length != 0 || sub2.length != 0) {
        throw new UnauthorizedException('Have a subject');
      } else {
        const newSub = new this.subjectModel({
          id_subject: sub.id_subject.toUpperCase(),
          subject_name: sub.subject_name,
          credit: sub.credit,
          learn: sub.learn,
        });

        await newSub.save();

        //const result = await this.getAllSubject(filterQuery);
        return filterQuery;
      }
      //console.log(filterQuery);
    } else {
      throw new UnauthorizedException('Not Authorization!');
    }
  }
  // sửa môn học trong d
  async updateSubject(sub: any) {
    const subFind = await this.subjectModel.findById(sub._id);
    //console.log(sub, subFind);
    await subFind.update({
      $set: {
        id_subject: sub.id_subject,
        subject_name: sub.subject_name,
        credit: sub.credit,
        learn: sub.learn,
      },
    });
    const result = await this.subjectModel.find();
    return result;
  }
  // xóa môn học trong db
  async deleteSubject(id: any) {
    await this.subjectModel.findOneAndDelete({ _id: id.id_subject });
    // delete các bảng có dữ liệu liên quan như class, score , sedule

    const result = await this.subjectModel.find();
    return result;
  }

  // nhận về các môn học
  async getAllSubject(filterQuery: any) {
    const allSubject = await this.subjectModel.find();

    const filterSearch = allSubject.filter((subject) => {
      if (subject.subject_name.includes(filterQuery.search)) return subject;
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
        totalSubject: allSubject.length,
        page_total: pageTotal,
        page: filterQuery.page,
        limit: filterQuery.limit,
        subject: classData,
        search: filterQuery.search,
      };

      return result;
    } else {
      // lọc kết quả theo kết quả có đki hay không
      // console.log(pageTotal)
      const newFilterSearch = filterSearch.reverse();

      const classData = newFilterSearch.slice(dataStart, dataEnd);
      //console.log(filterSelect[0])
      const result = {
        totalSubject: allSubject.length,
        page_total: pageTotal,
        page: filterQuery.page,
        limit: filterQuery.limit,
        subject: classData,
        search: filterQuery.search,
      };

      return result;
    }
  }
  // tìm môn học theeo tên
  async findSubjectNameAndId(name_subject: string, id_subject: string) {
    //console.log(id_subject)
    const subject1 = await this.subjectModel.find({
      id_subject: id_subject,
    });
    const subject2 = await this.subjectModel.find({
      subject_name: name_subject,
    });
    return [subject1, subject2];
  }
}
