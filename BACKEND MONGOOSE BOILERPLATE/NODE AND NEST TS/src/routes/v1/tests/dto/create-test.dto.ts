import { IsNotEmpty, IsString } from "class-validator";
import { UploadImages } from "src/types";

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  image: UploadImages[];
}
