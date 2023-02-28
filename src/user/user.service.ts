import { User } from './../untils/schemas/user.schema';
import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, UserData } from 'src/untils/schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('UserData') private readonly userDataModel: Model<UserData>,
    @InjectModel('Role') private readonly roleModel: Model<Role>,
  ) {}


  async findOneUser(user_name: string) {
    const user = await this.userModel
      .find({ user_name: user_name })
      .populate('id_role');
    return user[0];
  }
}
