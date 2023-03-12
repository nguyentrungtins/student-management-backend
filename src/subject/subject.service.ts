import { UpdateSub } from './dto/updateSub.dto';
import { SubjectDTO } from './dto/subject.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Subject } from './../utils/schemas/subject.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Marjor } from 'src/utils/schemas/marjor.schema';
import { Class, Score, StudentRegister } from 'src/utils/schemas';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('Marjor') private readonly marjorModel: Model<Marjor>,
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Score') private readonly scoreModel: Model<Score>,
    @InjectModel('StudentRegister')
    private readonly studentRegisterModel: Model<StudentRegister>,
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
          marjor_learn: sub.marjor_learn,
          lab_required: sub.lab_required,
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
  async updateSubject(sub: SubjectDTO, filterQuery: any) {
    const subFind = await this.subjectModel.findById(sub._id);
    //console.log(sub, subFind);
    await subFind.updateOne({
      $set: {
        id_subject: sub.id_subject.toUpperCase(),
        subject_name: sub.subject_name,
        credit: sub.credit,
        learn: sub.learn,
        marjor_learn: sub.marjor_learn,
        lab_required: sub.lab_required,
      },
    });
    const result = await this.getAllSubject(filterQuery);
    return result;
  }
  // xóa môn học trong db
  async deleteSubject(id: any) {
    // delete các bảng có dữ liệu liên quan như class, score , sedule
    //

    const _class = await this.classModel.find({
      id_subject: id.id_subject,
    });

    const _check = await _class.some((item) => item.status == true);
    if (!_check) {
      await this.subjectModel.findOneAndDelete({ _id: id.id_subject });
      Promise.all(
        _class.map(
          async (item) =>
            await this.studentRegisterModel.deleteMany({ id_class: item._id }),
        ),
      );

      await this.classModel.deleteMany({
        id_subject: id.id_subject,
      });

      await this.scoreModel.deleteMany({
        id_subject: id.id_subject,
      });

      //console.log(_class);

      const result = await this.subjectModel.find();
      return result;
    } else {
      throw new UnauthorizedException('Fails!');
    }
  }

  // nhận về các môn học
  async getAllSubject(filterQuery: any) {
    const allSubject = await this.subjectModel.find();
    const allMarjor = await this.marjorModel.find();
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
        subject: classData,
        marjor: allMarjor,
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
        subject: classData,
        marjor: allMarjor,
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
