import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { TestsChildService } from "./tests-child.service";
import { CreateTestsChildDto } from "./dto/create-tests-child.dto";
import { UpdateTestsChildDto } from "./dto/update-tests-child.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE } from "src/constants";

@Controller()
export class TestsChildController {
  constructor(private readonly service: TestsChildService) {}

  @Get()
  async getTestsChild() {
    const data = await this.service.getAll();

    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No TestsChild found"
        : "All TestsChild retrieved successfully",
    );
  }

  @Get(PATH.DELETED)
  async getDeletedTestsChild() {
    const data = await this.service.getAllDeleted();

    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted TestsChild found"
        : "All Deleted TestsChild retrieved successfully",
    );
  }

  @Get(PATH.ID)
  async getTestChildById(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.getById(_id);

    return responseHandler(
      data,
      !data ? "No TestChild found" : "TestChild retrieved successfully",
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  async createTestChild(
    @Body() createTestsChildDto: CreateTestsChildDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    const data = await this.service.add({
      ...createTestsChildDto,
      image: uploadedImages,
    });

    return responseHandler([data], "TestChild created successfully");
  }

  @Patch(PATH.EDIT)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  async updateTestChild(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateTestsChildDto: UpdateTestsChildDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const oldData = await this.service.getImageById(_id);

    const uploadNewImages = await multipleImages(
      files,
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await this.service.update(_id, {
      ...updateTestsChildDto,
      image: uploadNewImages,
    });

    return responseHandler([data], "TestChild updated successfully");
  }

  @Delete(PATH.DELETE)
  async deleteTestChild(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.deleteById(_id);

    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted
        ? "TestChild is already deleted"
        : "TestChild deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  async restoreTestChild(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.restoreById(_id);

    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted
        ? "TestChild is not deleted"
        : "TestChild restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  async forceDeleteTestChild(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.forceDelete(_id);

    const message = !data
      ? "No TestChild found"
      : "TestChild force deleted successfully";

    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );

    return responseHandler(data, message);
  }
}
