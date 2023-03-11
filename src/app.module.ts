/* eslint-disable prettier/prettier */
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
import { MulterModule } from '@nestjs/platform-express/multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RegisterClassModule } from './register-class/register-class.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ScoreModule } from './score/score.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MulterModule.register({
      dest: './src/utils/images',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './src/utils/images'),
      serveRoot: '/images/',
    }),
    AuthModule,
    UserModule,
    SubjectModule,
    ClassModule,
    TeacherModule,
    RegisterClassModule,
    SchedulingModule,
    ScoreModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
