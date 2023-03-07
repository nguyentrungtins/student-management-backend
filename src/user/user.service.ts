/* eslint-disable prettier/prettier */
import { UserDataDTO } from './dto/userData.dto';
import { User } from './../utils/schemas/user.schema';
import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, UserData } from 'src/utils/schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    @InjectModel('UserData') private readonly userDataModel: Model<UserData>,
  ) {}

  async findOneUser(user_name: string) {
    const user = await this.userModel
      .find({ user_name: user_name })
      .populate('id_role');
    return user[0];
  }

  async addUser(addUser: any, imgUrl: any) {
    // console.log(addUser.name, imgUrl);
    const newUser = new this.userDataModel({
      id_student: addUser.id_student,
      img: imgUrl,
      first_name: addUser.first_name,
      last_name: addUser.last_name,
      address: addUser.address,
      phone: addUser.phone,
      email: addUser.email,
      birth_day: addUser.birth_day,
      major: addUser.major,
    });

    const result = await newUser.save();
    const role = await this.roleModel.find({ name_role: 'Student' });
    const randomPassword = Math.random().toString(36).slice(-8);

    const addNewUser = new this.userModel({
      id_user: result._id,
      user_name: result.id_student,
      pass_word: randomPassword,
      id_role: role[0]._id,
    });
    await addNewUser.save();
    const account = await this.userModel.find().populate('id_user');
    return account;
  }

  async getUser(id_user: any) {
    const infoUser = this.userModel.findById(id_user).populate('id_user');
    return infoUser;
  }
}
