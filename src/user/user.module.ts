import { User, UserSchema } from './../untils/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { RoleSchema, UserDataSchema } from 'src/untils/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
