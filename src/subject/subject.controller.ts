import { UpdateSub } from './dto/updateSub.dto';
import { SubjectService } from './subject.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { SubjectDTO } from './dto';

@Controller('/subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  addSubject(@Body() sub: SubjectDTO) {
    return this.subjectService.addSubject(sub);
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
