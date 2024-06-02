import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateTestDto } from "./create-test.dto";
import { UploadImages } from "src/types";

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  image: UploadImages[];
}
