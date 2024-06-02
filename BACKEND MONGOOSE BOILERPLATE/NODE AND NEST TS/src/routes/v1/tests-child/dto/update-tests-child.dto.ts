import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateTestsChildDto } from "./create-tests-child.dto";
import { UploadImages } from "src/types";

export class UpdateTestsChildDto extends PartialType(CreateTestsChildDto) {
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
