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
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard, TokenService, Roles } from "src/middleware";

@Controller()
export class UsersController {
  constructor(
    private service: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  async getUsers() {
    const data = await this.service.getAll();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Users found"
        : "All Users retrieved successfully",
    );
  }

  @Get(PATH.DELETED)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  async getDeletedUsers() {
    const data = await this.service.getAllDeleted();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No Deleted Users found"
        : "All Deleted Users retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  async getUserById(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.getById(_id);
    return responseHandler(
      data,
      !data ? "No User found" : "User retrieved successfully",
    );
  }

  @Post(PATH.LOGIN)
  async loginUser(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const data = await this.service.getEmail(email);

    if (!data) return responseHandler([], "No User found");

    if (!(await bcrypt.compare(password, data.password))) {
      return responseHandler([], "Password does not match");
    }

    const accessToken = this.jwtService.sign({ role: data[RESOURCE.ROLE] });
    this.tokenService.setToken(accessToken);

    return responseHandler(data, "User Login successfully", {
      accessToken,
    });
  }

  @Post(PATH.LOGOUT)
  async logoutUser() {
    const savedToken = this.tokenService.getToken();

    if (savedToken) this.tokenService.blacklistToken();

    return responseHandler([], "User logout successful");
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);
    createUserDto.image = uploadedImages;

    const data = await this.service.add(createUserDto);
    return responseHandler([data], "User created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("image"))
  async updateUser(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const oldData = await this.service.getById(_id);

    const uploadNewImages = await multipleImages(
      files,
      oldData?.image.map((image) => image.public_id) || [],
    );
    updateUserDto.image = uploadNewImages;

    const data = await this.service.update(_id, updateUserDto);
    return responseHandler([data], "User updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async deleteUser(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.deleteById(_id);
    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "User is already deleted" : "User deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async restoreUser(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.restoreById(_id);
    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted ? "User is not deleted" : "User restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async forceDeleteUser(@Param(RESOURCE.ID) _id: string) {
    const data = await this.service.forceDelete(_id);
    const message = !data ? "No User found" : "User force deleted successfully";
    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );
    return responseHandler(data, message);
  }
}
