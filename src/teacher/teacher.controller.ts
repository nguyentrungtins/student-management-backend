import { UpdateTeacherDTO } from './dto/updateTeacher.dto';
import { TeacherDTO } from './dto/teacher.dto';
import { TeacherService } from './teacher.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}
  @Post('/add')
  addTeacher(@Body() newTeacher: TeacherDTO) {
    return this.teacherService.addTeacher(newTeacher);
  }

  @Post('/update')
  updateTeacher(@Body() updateTeacher: UpdateTeacherDTO) {
    return this.teacherService.updateTeacher(updateTeacher);
  }

  @Post('/delete')
  deleteTeacher(@Body() id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
