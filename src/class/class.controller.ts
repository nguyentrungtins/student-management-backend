import { AuthGuard } from '@nestjs/passport';
import { RegisterClassService } from './../register-class/register-class.service';
import { ClassDTO } from './dto/class.dto';
import { ClassService } from './class.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateClassDTO } from './dto/updateClass.dto';

@Controller('/class')
export class ClassController {
  constructor(
    private classService: ClassService,
    private registerClassService: RegisterClassService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  addClass(@Body() newClass: ClassDTO) {
    return this.classService.addClass(newClass);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  updateClass(@Body() updateClass: ClassDTO, @Query() query: any) {
    return this.classService.updateClass(updateClass, query);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/delete')
  deleteClass(@Body() id: any) {
    return this.classService.deleteClass(id);
  }
  // lấy thông tin lớp học
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/')
  getClass(@Request() req: any, @Query() query: any) {
    //console.log(req.user);
    return this.classService.getClass(query, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/get/admin')
  getClassAdmin(@Body() query: any) {
    //console.log(req.user);
    return this.classService.getClassAdmin(query);
  }

  //reset lại một lớp học dành cho hki kế tiếp mà không cần xóa
  @Post('/reset')
  resetClass(@Body() id: any, @Query() query: any) {
    //console.log(id,query)
    return this.classService.resetClass(id, query);
  }

  // đăng ki hoặc hủy đăng kí 1 sinh viên _id với class _id
  @UseGuards(AuthGuard('jwt'))
  @Post('/sign')
  signClass(@Request() req: any, @Body() information: any) {
    return this.classService.registerClass(information, req.user);
  }
}
