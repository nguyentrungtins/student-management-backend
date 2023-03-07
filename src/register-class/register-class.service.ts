import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, StudentRegister, User } from 'src/utils/schemas';

@Injectable()
export class RegisterClassService {
  constructor(
    @InjectModel('StudentRegister')
    private readonly studentRegisterModel: Model<StudentRegister>,
  ) {}

  // thêm 1 học sinh mới vào lớp
  async addNewUser(id: any) {
    const newUserInClass = new this.studentRegisterModel({
      id_class: id.id_class,
      id_user: id.id_user,
    });
    await newUserInClass.save();
    const result = await this.studentRegisterModel.find();
    return result;
  }

  // tìm xem 1 user có id xxx có nằm trong lớp hay không
  async isUserInClass(id: any) {
    const isUIC = await this.studentRegisterModel.find({
      id_class: id.id_class,
      id_user: id.id_user,
    });

    if (isUIC.length != 0) return true;
    return false;
  }
}
