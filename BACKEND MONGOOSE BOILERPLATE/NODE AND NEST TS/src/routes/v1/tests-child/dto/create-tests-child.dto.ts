import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestsChildDto {
  @IsMongoId()
  @IsNotEmpty()
  test: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
