/* eslint-disable prettier/prettier */
import { UpdateTeacherDTO } from './dto/updateTeacher.dto';
import { TeacherDTO } from './dto/teacher.dto';
import { TeacherService } from './teacher.service';
import { Controller, Post, Body, Query } from '@nestjs/common';
import { query } from 'express';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post('/get')
  getAllTeacher(@Body() filterQuery: any) {
    return this.teacherService.getAllTeacher(filterQuery);
  }
  @Post('/add')
  addTeacher(@Body() newTeacher: TeacherDTO) {
    return this.teacherService.addTeacher(newTeacher);
  }

  @Post('/update')
  updateTeacher(@Body() updateTeacher: TeacherDTO, @Query() filterQuery: any) {
    return this.teacherService.updateTeacher(updateTeacher, filterQuery);
  }

  @Post('/delete')
  deleteTeacher(@Body() id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
