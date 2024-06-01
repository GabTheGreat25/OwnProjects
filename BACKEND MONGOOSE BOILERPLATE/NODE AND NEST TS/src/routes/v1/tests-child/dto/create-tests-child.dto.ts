import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestsChildDto {
  @IsNotEmpty()
  @IsMongoId()
  test: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
