/* eslint-disable prettier/prettier */
import { UserController } from './user.controller';
import { UserDataSchema } from './../untils/schemas/userData.schema';
import { User, UserSchema } from './../untils/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { RoleSchema } from 'src/untils/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
