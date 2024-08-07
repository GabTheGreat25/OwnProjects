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
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import {
  responseHandler,
  multipleImages,
  sendEmail,
  generateRandomCode,
} from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
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
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const data = await this.service.getEmail(loginUserDto.email);

    if (!data) throw new NotFoundException("No User Found");

    if (!(await bcrypt.compare(loginUserDto.password, data.password)))
      throw new UnauthorizedException("Password does not match");

    const accessToken = this.jwtService.sign({
      id: data._id,
      role: data[RESOURCE.ROLE],
    });
    this.tokenService.setToken(accessToken);

    return responseHandler(data, "User Login successfully", {
      accessToken,
    });
  }

  @Post(PATH.LOGOUT)
  async logoutUser() {
    const savedToken = this.tokenService.getToken();

    return !savedToken || this.tokenService.isTokenBlacklisted()
      ? (() => {
          throw new UnauthorizedException("You are not logged in");
        })()
      : (this.tokenService.blacklistToken(),
        responseHandler([], "User Logout successfully"));
  }

  @Post()
  @UseInterceptors(FilesInterceptor("image"))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw new BadRequestException("At least one image is required.");

    const data = await this.service.add(
      {
        ...createUserDto,
        image: uploadedImages,
      },
      (req as any).session,
    );

    return responseHandler([data], "User created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  @UseInterceptors(FilesInterceptor("image"))
  async updateUser(
    @Param(RESOURCE.ID) _id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const oldData = await this.service.getById(_id);

    const uploadNewImages = await multipleImages(
      files,
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await this.service.update(
      _id,
      {
        ...updateUserDto,
        image: uploadNewImages,
      },
      (req as any).session,
    );

    return responseHandler([data], "User updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async deleteUser(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.deleteById(_id, (req as any).session);

    return responseHandler(
      data?.deleted ? [] : [data],
      data?.deleted ? "User is already deleted" : "User deleted successfully",
    );
  }

  @Put(PATH.RESTORE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async restoreUser(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.restoreById(_id, (req as any).session);

    return responseHandler(
      !data?.deleted ? [] : data,
      !data?.deleted ? "User is not deleted" : "User restored successfully",
    );
  }

  @Delete(PATH.FORCE_DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE)
  async forceDeleteUser(@Param(RESOURCE.ID) _id: string, @Req() req: Request) {
    const data = await this.service.forceDelete(_id, (req as any).session);

    const message = !data ? "No User found" : "User force deleted successfully";

    await multipleImages(
      [],
      data?.image ? data.image.map((image) => image.public_id) : [],
    );

    return responseHandler(data, message);
  }

  @Patch(PATH.CHANGE_PASSWORD)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.CUSTOMER)
  async changeUserPassword(
    @Param(RESOURCE.ID) _id: string,
    @Body() body: { newPassword: string; confirmPassword: string },
    @Req() req: Request,
  ) {
    const { newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword)
      throw new BadRequestException("Both passwords are required");

    if (newPassword !== confirmPassword)
      throw new BadRequestException("Passwords do not match");

    const data = await this.service.changePassword(
      _id,
      newPassword,
      (req as any).session,
    );

    return responseHandler([data], "Password changed successfully");
  }

  @Post(PATH.EMAIL_OTP)
  async sendUserEmailOTP(@Body() body: { email: string }, @Req() req: Request) {
    const existingEmail = await this.service.getEmail(body.email);

    const verificationCode = existingEmail.verificationCode;

    if (existingEmail.verificationCode)
      if (
        new Date().getTime() - new Date(verificationCode.createdAt).getTime() <
        5 * 60 * 1000
      )
        throw new BadRequestException(
          "Please wait 5 minutes before requesting a new verification code.",
        );

    const code = generateRandomCode();
    await sendEmail(body.email, code);

    const data = await this.service.sendEmailOTP(
      body.email,
      code,
      (req as any).session,
    );

    return responseHandler([data], "Email OTP sent successfully");
  }

  @Patch(PATH.RESTORE_PASSWORD)
  async resetUserEmailPassword(
    @Body()
    body: {
      newPassword: string;
      confirmPassword: string;
      verificationCode: string;
    },
    @Req() req: Request,
  ) {
    if (
      !body.newPassword ||
      !body.confirmPassword ||
      body.newPassword !== body.confirmPassword
    )
      throw new BadRequestException("Passwords are required and must match");

    const code = await this.service.getCode(body.verificationCode);

    if (
      Date.now() - new Date(code.verificationCode.createdAt).getTime() >
      5 * 60 * 1000
    ) {
      code.verificationCode = null;
      await code.save();
      throw new BadRequestException("Verification code has expired");
    }

    const data = await this.service.resetPassword(
      body.verificationCode,
      body.newPassword,
      (req as any).session,
    );

    if (!data) throw new BadRequestException("Invalid verification code");

    return responseHandler([data], "Password Successfully Reset");
  }
}
