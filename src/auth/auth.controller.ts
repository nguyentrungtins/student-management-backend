<<<<<<< HEAD
import { AuthGuard } from '@nestjs/passport';
=======
/* eslint-disable prettier/prettier */
>>>>>>> master
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  login(@Body() auth: AuthDTO) {
    return this.authService.login(auth);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh')
  refreshToken(@Request() req: any) {
    return this.authService.getRefreshToken(req.user);
  }
}
