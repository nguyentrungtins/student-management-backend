/* eslint-disable prettier/prettier */
import { AuthDTO } from './dto/auth.dto';
import { UserService } from './../user/user.service';
import { Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Marjor } from 'src/utils/schemas/marjor.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Marjor') private readonly marjorModel: Model<Marjor>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(auth: AuthDTO) {
    const user = await this.userService.findOneUser(auth.user_name);
    //console.log(user);

    if (!user) {
      throw new UnauthorizedException('Not correct account!');
    } else {
      if (
        user.pass_word == auth.pass_word &&
        user.pass_word == 'defaultpassword'
      ) {
        if (user.id_role.name_role == 'Admin') {
          return {
            access_token: this.signJWT(
              String(user._id),
              user.id_role.name_role,
              '',
            ),
            refresh_token: this.signJWTRefreshToken(
              String(user._id),
              user.id_role.name_role,
              '',
            ),
            role: user.id_role.name_role,
          };
        } else {
          const _marjor = await this.marjorModel.find({
            id_marjor: user.id_user.major,
          });
          const name_marjor = _marjor[0].name_marjor || '';
          const name =
            `${user.id_user.first_name} ${user.id_user.last_name}` || '';
          const totalName = name_marjor + '|' + name || '';
          //console.log(name);
          return {
            access_token: this.signJWT(
              String(user._id),
              user.id_role.name_role,
              String(totalName),
            ),
            refresh_token: this.signJWTRefreshToken(
              String(user._id),
              user.id_role.name_role,
              String(totalName),
            ),
            role: user.id_role.name_role,
          };
        }
      } else {
        //const saltOrRounds = 1;
        //c/onst password = 'abc123';
        //const hash = await bcrypt.hash(password,saltOrRounds);

        //console.log(hash);

        const isMatch = await bcrypt.compare(auth.pass_word, user.pass_word);

        if (isMatch) {
          if (user.id_role.name_role == 'Admin') {
            return {
              access_token: this.signJWT(
                String(user._id),
                user.id_role.name_role,
                '',
              ),
              refresh_token: this.signJWTRefreshToken(
                String(user._id),
                user.id_role.name_role,
                '',
              ),
              role: user.id_role.name_role,
            };
          } else {
            const _marjor = await this.marjorModel.find({
              id_marjor: user.id_user.major,
            });
            const name_marjor = _marjor[0].name_marjor || '';
            const name =
              `${user.id_user.first_name} ${user.id_user.last_name}` || '';
            const totalName = name_marjor + '|' + name || '';
            //console.log(name);
            return {
              access_token: this.signJWT(
                String(user._id),
                user.id_role.name_role,
                String(totalName),
              ),
              refresh_token: this.signJWTRefreshToken(
                String(user._id),
                user.id_role.name_role,
                String(totalName),
              ),
              role: user.id_role.name_role,
            };
          }
        } else {
          throw new UnauthorizedException('Not correct account!');
        }
      }
    }
  }

  async getRefreshToken(user: any) {
    console.log('1 lần');
    return {
      access_token: this.signJWT(
        String(user.user_id),
        user.user_name,
        user.role,
      ),
      refresh_token: this.signJWTRefreshToken(
        String(user.user_id),
        user.user_name,
        user.role,
      ),
      //role: user.id_role.name_role,
    };
  }

  // hàm kí jwt
  signJWT(
    id_user: string,
    //user_name: string,
    role: string,
    totalName: string,
  ) {
    return this.jwtService.sign({
      id: id_user,
      //user_name,
      role,
      totalName,
    });
  }

  signJWTRefreshToken(id_user: string, totalName: string, role: string) {
    return this.jwtService.sign(
      {
        id: id_user,
        totalName,
        role,
      },
      {
        secret: 'Refresh-token',
        expiresIn: 24 * 60 * 60,
      },
    );
  }
}
