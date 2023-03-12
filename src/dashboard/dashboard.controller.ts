import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardService.create(createDashboardDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/client')
  findOne(@Request() req: any): any {
    return this.dashboardService.findDashboardDataClient(req.user.user_id);
    // return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/admin')
  findAll(): any {
    return this.dashboardService.findDashboardDataAdmin();
    // return req.user;
  }
}
