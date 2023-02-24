import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  pass_word: string;
}
