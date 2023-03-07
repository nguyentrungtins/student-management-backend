import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { Schedule } from 'src/utils/schemas';
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  create(@Body() createSchedulingDto: CreateSchedulingDto): Promise<Schedule> {
    return this.schedulingService.create(createSchedulingDto);
  }

  @Get()
  findAll(): Promise<Schedule[]> {
    return this.schedulingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(+id);
  }

  @Post('/calculate/:major')
  schedulingCalculate(@Param('major') major: string) {
    return this.schedulingService.schedulingTimeTable(major);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchedulingDto: UpdateSchedulingDto,
  ) {
    return this.schedulingService.update(+id, updateSchedulingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulingService.remove(+id);
  }
}
