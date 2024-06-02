import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UploadImages } from "src/types";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  image: UploadImages[];
}
