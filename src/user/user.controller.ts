/* eslint-disable prettier/prettier */
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserDataDTO } from './dto/userData.dto';
import { Body, Controller, Post, Get, Req, Request } from '@nestjs/common';
import { UpdateUserDataDTO } from './dto/updateUserData.dto';
import {
  Delete,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './src/utils/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `student-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(
    @Body() student: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addUser(student, file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/student')
  getStudent(@Req() req: any) {
    return this.userService.getUser(req.user.user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/getPassword')
  getPass(@Body() password: any, @Request() user: any) {
<<<<<<< HEAD
    return this.userService.getPassword(password, user.user.user_id);
  }

  @Post('/delete')
  deleteStudent() {
    return 'ok';
=======
    // return this.userService.getPassword(req.user.pass_word);
    // console.log(user.user)
    return this.userService.getPassword(password, user.user.user_id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.deleteStudent(id);
>>>>>>> 2b9a9fc7f1546fa48c58125f260b5c8e32be36d5
  }
  // @Post('/update')
  // updateUser(@Body() updateUser: UpdateUserDataDTO) {
  //   return this.userService.updateUser(updateUser);
  // }

  // @Post('/delete')
  // deleteUser(@Body() id: string) {
  //   return this.userService.deleteUser(id);
  // }
}
