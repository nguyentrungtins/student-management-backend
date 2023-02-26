import { UpdateSub } from './dto/updateSub.dto';
import { SubjectDTO } from './dto/subject.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Subject } from './../untils/schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
  ) {}
  // thêm 1 môn học vào db
  async addSubject(sub: SubjectDTO) {
    const sub1 = await this.findSubjectName(sub.subject_name);
    if (sub1.length != 0 && sub1[0].id_subject == sub.id_subject) {
      throw new UnauthorizedException('have a subject');
    } else {
      const newSub = new this.subjectModel({
        id_subject: sub.id_subject,
        subject_name: sub.subject_name,
        credit: sub.credit,
        learn: sub.learn,
      });
      const result = await this.subjectModel.find();
      return result;
    }
  }
  // sửa môn học trong db
  async updateSubject(sub: UpdateSub) {
    const subFind = await this.subjectModel.findById(sub.id);
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
  // tìm môn học theeo tên
  async findSubjectName(name_subject: string) {
    const subject = await this.subjectModel.find({
      subject_name: name_subject,
    });
    return subject;
  }
}
