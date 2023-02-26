import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { ClassModule } from './class/class.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AuthModule,
    UserModule,
    SubjectModule,
    ClassModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
