import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsNotEmpty()
  image: UploadImages[];
}
