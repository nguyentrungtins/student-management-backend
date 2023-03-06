import { UpdateSub } from './dto/updateSub.dto';
import { SubjectService } from './subject.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { SubjectDTO } from './dto';

@Controller('/subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}
  @Post('/get')
  getAllSubject(@Body() filterQuery: any) {
    return this.subjectService.getAllSubject(filterQuery);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  addSubject(@Request() req: any, @Body() sub: any) {
    //console.log(sub.filterQuey);
    return this.subjectService.addSubject(
      sub.newSubject,
      sub.filterQuey,
      req.user,
    );
  }
  @Post('/update')
  updateSubject(@Body() sub: UpdateSub) {
    return this.subjectService.updateSubject(sub);
  }
  @Post('/delete')
  deleteSubject(@Body() id: any) {
    return this.subjectService.deleteSubject(id);
  }
}
