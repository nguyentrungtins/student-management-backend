import { UnauthorizedException } from '@nestjs/common/exceptions';
import { User } from './../utils/schemas/user.schema';
import { Subject } from './../utils/schemas/subject.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, Score } from 'src/utils/schemas';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel('Score') private readonly scoreModel: Model<Score>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('Class') private readonly classModel: Model<Class>,
  ) {}

  async getStudentInClass(id_subject: string, filterQuery: any) {
    //console.log(id_subject)
    const _subject = await this.subjectModel.find({
      id_subject: id_subject,
    });

    if (_subject.length > 0) {
      const allStudentInSubject = await this.scoreModel
        .find({
          id_subject: _subject[0]._id,
        })
        .populate({
          path: 'id_user',
          populate: {
            path: 'id_user',
          },
        })
        .populate('id_subject');

      const filterResult = allStudentInSubject.filter((data) => {
        if (filterQuery.select == 'all') return data;
        if (filterQuery.select == 'yes') {
          return data.score != null;
        }
        if (filterQuery.select == 'no') {
          return data.score == null;
        }
      });
      const pageTotal = Math.ceil(filterResult.length / filterQuery.limit);
      const dataStart = (filterQuery.page - 1) * filterQuery.limit;
      const dataEnd = dataStart + filterQuery.limit;

      if (pageTotal == filterQuery.page) {
        const data = filterResult.slice(dataStart, filterResult.length);
        //console.log(classData)
        const result = {
          page_total: pageTotal,
          page: filterQuery.page,
          limit: filterQuery.limit,
          select: filterQuery.select,
          data: data,
        };

        return result;
      } else {
        const data = filterResult.slice(dataStart, dataEnd);
        const result = {
          page_total: pageTotal,
          page: filterQuery.page,
          limit: filterQuery.limit,
          select: filterQuery.select,
          data: data,
        };

        return result;
      }
      //console.log(allStudentInSubject);
    } else {
      throw new UnauthorizedException('No subject!');
    }
  }

  async addOneStudentScore(obj: any, filterQuery) {
    const _class = await this.classModel.find({
      id_subject: obj.id_subject,
    });

    const _check = await _class.some((item) => item.status == false);
    if (_check) {
      throw new BadRequestException('Cac lop chua co lich day!');
    } else {
      await this.scoreModel.findOneAndUpdate(
        {
          id_user: obj.id_user,
          id_subject: obj.id_subject,
        },
        {
          $set: {
            score: obj.score,
          },
        },
      );

      const _subject = await this.subjectModel.findById(obj.id_subject);
      //console.log(_subject);
      return this.getStudentInClass(_subject.id_subject, filterQuery);
    }
  }

  async getScoreStudent(user: any) {
    const result = await this.scoreModel
      .find({
        id_user: user.user_id,
      })
      .populate({ path: 'id_user', populate: { path: 'id_user' } })
      .populate('id_subject');

    const abc = result.map((item) => {
      return {
        user: item.id_user.id_user,
        score: item.score,
        subject: item.id_subject,
      };
    });

    return abc;
  }

  async addMutiStudentScore(arr: any, filterQuery) {
    const _class = await this.classModel.find({
      id_subject: arr[0].id_subject,
    });

    const _check = await _class.some((item) => item.status == false);
    if (_check) {
      throw new BadRequestException('Cac lop chua co lich day!');
    } else {
      Promise.all(
        arr.map(async (item) => {
          await this.scoreModel.findOneAndUpdate(
            {
              id_user: item.id_user,
              id_subject: item.id_subject,
            },
            {
              $set: {
                score: item.score,
              },
            },
          );
        }),
      );
      const _subject = await this.subjectModel.findById(arr[0].id_subject);
      //console.log(_subject);
      return this.getStudentInClass(_subject.id_subject, filterQuery);
    }
  }
}
