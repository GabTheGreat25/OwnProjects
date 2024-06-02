import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { UploadImages } from "src/types";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  image: UploadImages[];
}
