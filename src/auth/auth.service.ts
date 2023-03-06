import { AuthDTO } from './dto/auth.dto';
import { UserService } from './../user/user.service';
import { Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(auth: AuthDTO) {
    const user = await this.userService.findOneUser(auth.user_name);

    if (!user || user.pass_word != auth.pass_word) {
      throw new UnauthorizedException('Not correct account!');
    }
    return {
      access_token: this.signJWT(
        String(user._id),
        user.user_name,
        user.id_role.name_role,
      ),
      role: user.id_role.name_role,
    };
  }

  // hàm kí jwt
  signJWT(id_user: string, user_name: string, role: string) {
    return this.jwtService.sign({
      id: id_user,
      user_name,
      role,
    });
  }
}
