import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { UserDataDTO } from './dto/userData.dto';
import { User } from './../utils/schemas/user.schema';
import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, UserData } from 'src/utils/schemas';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';

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
  async findAll() {
    const users = await this.userDataModel.find();
    return users;
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
      birth_date: addUser.birth_day,
      major: addUser.major,
    });

    const checkNewUser = await this.userDataModel.find({
      id_student: newUser.id_student,
    });

    if (checkNewUser.length > 0) {
      throw new BadRequestException('User existed');
    }

    const result = await newUser.save();
    // console.log(newUser);
    const role = await this.roleModel.find({ name_role: 'Student' });
    // const randomPassword = Math.random().toString(36).slice(-8);

    const addNewUser = new this.userModel({
      id_user: result._id,
      user_name: result.id_student,
      pass_word: `defaultpassword`,
      id_role: role[0]._id,
    });

    const checkUserName = await this.userModel.find({
      user_name: addNewUser.user_name,
    });

    if (checkUserName.length > 0) {
      throw new BadRequestException('User existed');
    }

    await addNewUser.save();
    const users = await this.userDataModel.find();
    return users;
  }

  async updateUser(addUser: any, imgUrl: any) {
    // console.log(addUser.name, imgUrl);
    // console.log('update', addUser);
    const updateData = {
      id_student: addUser.id_student,
      img: imgUrl ? imgUrl : addUser?.image,
      first_name: addUser.first_name,
      last_name: addUser.last_name,
      address: addUser.address,
      phone: addUser.phone,
      email: addUser.email,
      birth_date: addUser.birth_day,
      major: addUser.major,
    };

    const checkNewUser = await this.userDataModel.findById(addUser.id);

    if (!checkNewUser) {
      throw new NotFoundException('Could not find user this id');
    }
    const filter = { _id: checkNewUser._id };
    const updatedUserData = await this.userDataModel.findOneAndUpdate(
      filter,
      updateData,
    );
    // // console.log(newUser);
    // const role = await this.roleModel.find({ name_role: 'Student' });
    // const randomPassword = Math.random().toString(36).slice(-8);

    const addNewUserData = {
      user_name: addUser.id_student,
      // pass_word: addUser.pass_word,
    };

    const checkUserName = await this.userModel.findOne({
      user_name: addUser.id_student,
    });
    if (checkUserName) {
      if (checkUserName.id_user !== addUser.id) {
        throw new BadRequestException('User ID existed');
      }
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { id_user: addUser.id },
      addNewUserData,
    );
    if (!updatedUser) {
      throw new BadRequestException('Can not update user');
    }
    const users = await this.userDataModel.find();
    return users;
  }

  async getUser(id_user: any) {
    const infoUser = this.userModel.findById(id_user).populate('id_user');
    return infoUser;
  }

  async getPassword(password: any, infoUser: any) {
    // console.log(infoUser)
    const findUser = await this.userModel.findById(infoUser);
    // console.log(findUser);
    if (findUser.pass_word == password.current_password) {
      const saltOrRounds = 1;
      // const password = 'random_password';
      const hash = await bcrypt.hash(password.new_password, saltOrRounds);
      await findUser.updateOne({
        $set: {
          pass_word: hash,
        },
      });
      return 'Password changed';
    } else {
      return 'Can not change password';
    }
  }
  async deleteStudent(id: string) {
    const user = await this.userDataModel.findById(id);
    if (!user) {
      throw new NotFoundException('Student not found');
    }
    const userDataDeleted = await this.userDataModel.findByIdAndDelete(id);
    const userDeleted = await this.userModel.findOneAndDelete({ id_user: id });
    if (!userDeleted || !userDataDeleted) {
      throw new BadRequestException('Cannot delete student');
    } else {
      const newList = await this.userDataModel.find();
      return newList;
    }
    return userDeleted;
  }
}
