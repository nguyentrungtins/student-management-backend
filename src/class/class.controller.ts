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

  @Post('/add')
  addClass(@Body() newClass: ClassDTO) {
    return this.classService.addClass(newClass);
  }
  @Post('/update')
  updateClass(@Body() updateClass: UpdateClassDTO) {
    return this.classService.updateClass(updateClass);
  }
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
}
