import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
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

    const checkNewUser = await this.userDataModel.find({
      id_student: newUser.id_student,
    });

    if (checkNewUser.length > 0) {
      throw new BadRequestException('User existed');
    }

    const result = await newUser.save();
    console.log(newUser);
    const role = await this.roleModel.find({ name_role: 'Student' });
    const randomPassword = Math.random().toString(36).slice(-8);

    const addNewUser = new this.userModel({
      id_user: result._id,
      user_name: result.id_student,
      pass_word: randomPassword,
      id_role: role[0]._id,
    });

    const checkUserName = await this.userModel.find({
      user_name: addNewUser.user_name,
    });

    if (checkUserName.length > 0) {
      throw new BadRequestException('User existed');
    }

    await addNewUser.save();
    const account = await this.userModel.find().populate('id_user');
    return account;
  }

  async getUser(id_user: any) {
    const infoUser = this.userModel.findById(id_user).populate('id_user');
    return infoUser;
  }

  async getPassword(password: any, infoUser: any) {
    // console.log(infoUser)
    const findUser = await this.userModel.findById(infoUser);
    console.log(findUser);
    if (findUser.pass_word == password.current_password) {
      // console.log('ok')
      await findUser.updateOne({
        $set: {
          pass_word: password.new_password,
        },
      });
      return 'Password changed';
    } else {
      return 'Can not change password';
    }
  }
}
