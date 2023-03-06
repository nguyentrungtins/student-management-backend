import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassSchema,
  StudentRegisterSchema,
  UserSchema,
} from 'src/untils/schemas';
import { RegisterClassService } from './register-class.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StudentRegister', schema: StudentRegisterSchema },
    ]),
  ],
  providers: [RegisterClassService],
  exports: [RegisterClassService],
})
export class RegisterClassModule {}
