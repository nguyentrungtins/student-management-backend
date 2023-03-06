import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
/* eslint-disable prettier/prettier */
import { UserService } from './user.service';
import { UserDataDTO } from './dto/userData.dto';
import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { UpdateUserDataDTO } from './dto/updateUserData.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // @Post('/add')
  // addUser(@Body() addUser: UserDataDTO) {
  //   return this.userService.addUser(addUser);
  // }

  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './src/untils/images',
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
  handleUpload(@Body() addImg: any, @UploadedFile() file: Express.Multer.File) {
    return this.userService.addUser(addImg, file.filename);
  }

  @Post('/student')
  getStudent(@Request() req: any) {
    //console.log(req.user);
    return this.userService.getUser(req.user.user_id);
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
