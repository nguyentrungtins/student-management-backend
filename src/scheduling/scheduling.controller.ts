import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Schedule } from 'src/utils/schemas';
import { AuthGuard } from '@nestjs/passport';
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<Schedule[]> {
    return this.schedulingService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/major')
  findMajor(): Promise<any> {
    return this.schedulingService.findAllMajor();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  getClassAdmin(@Request() req: any): Promise<Schedule[]> {
    return this.schedulingService.findOne(req.user.user_id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/calculate/:major')
  schedulingCalculate(@Param('major') major: string) {
    return this.schedulingService.schedulingTimeTable(major);
  }
}
