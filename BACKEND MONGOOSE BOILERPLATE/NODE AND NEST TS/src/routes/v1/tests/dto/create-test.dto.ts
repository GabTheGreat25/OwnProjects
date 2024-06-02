import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
