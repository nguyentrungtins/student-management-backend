import { ClassDTO } from './dto/class.dto';
import { ClassService } from './class.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UpdateClassDTO } from './dto/updateClass.dto';

@Controller('/class')
export class ClassController {
  constructor(private classService: ClassService) {}

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
}
