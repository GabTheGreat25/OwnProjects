import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { TestsService } from "./tests.service";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE } from "src/constants";

@Controller()
export class TestsController {
  constructor(private readonly service: TestsService) {}

  @Get()
  async getTests() {
    const data = await this.service.getAll();

    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Tests found"
        : "All Tests retrieved successfully",
    );
  }

  @Get(PATH.DELETED)
  async getDeletedTests() {
    const data = await this.service.getAllDeleted();

    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted Tests found"
        : "All Deleted Tests retrieved successfully",
    );
  }

  @Get(PATH.ID)
  async getTestById(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.getById(_id);

    return responseHandler(
      data,
      !data ? "No Test found" : "Test retrieved successfully",
    );
  }

  @Post()
  @UseInterceptors(FilesInterceptor("image"))
  async createTest(
    @Body() createTestDto: CreateTestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw new BadRequestException("At least one image is required.");

    const data = await this.service.add({
      ...createTestDto,
      image: uploadedImages,
    });

    return responseHandler([data], "Test created successfully");
  }

  @Patch(PATH.EDIT)
  @UseInterceptors(FilesInterceptor("image"))
  async updateTest(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateTestDto: UpdateTestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const oldData = await this.service.getById(_id);

    const uploadNewImages = await multipleImages(
      files,
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await this.service.update(_id, {
      ...updateTestDto,
      image: uploadNewImages,
    });

    return responseHandler([data], "Test updated successfully");
  }

  @Delete(PATH.DELETE)
  async deleteTest(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.deleteById(_id);

    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "Test is already deleted" : "Test deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  async restoreTest(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.restoreById(_id);

    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted ? "Test is not deleted" : "Test restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  async forceDeleteTest(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.forceDelete(_id);

    const message = !data ? "No Test found" : "Test force deleted successfully";

    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );

    return responseHandler(data, message);
  }
}
