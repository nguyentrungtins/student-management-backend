import { ScoreService } from './score.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreServive: ScoreService) {}
  @Post('/get')
  getStudentInClass(@Body() id: any, @Query() filterQuery: any) {
    //console.log(filterQuery);
    return this.scoreServive.getStudentInClass(id.id_subject, filterQuery);
  }

  @Post('/add/one')
  addOneStudentScore(@Body() obj: any, @Query() filterQuery: any) {
    //console.log(obj)
    return this.scoreServive.addOneStudentScore(obj, filterQuery);
  }

  @Post('/add/muti')
  addMutiStudentScore(@Body() arr: any, @Query() filterQuery: any) {
    return this.scoreServive.addMutiStudentScore(arr, filterQuery);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/student/get')
  getScoreStudent(@Request() req: any) {
    return this.scoreServive.getScoreStudent(req.user);
  }
}
