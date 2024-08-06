import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { User } from "./entities/user.entity";
import { Admin, Employee, Customer } from "./discriminators";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ROLE, RESOURCE } from "src/constants";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  getAll() {
    return this.userModel.find({ deleted: false });
  }

  getAllDeleted() {
    return this.userModel.find({ deleted: true });
  }

  getById(_id: string) {
    return this.userModel.findOne({ _id, deleted: false });
  }

  getEmail(email: string) {
    return this.userModel
      .findOne({ email, deleted: false })
      .select(RESOURCE.PASSWORD);
  }

  async add(createUserDto: CreateUserDto, session: ClientSession) {
    const modelToUse =
      createUserDto.role === ROLE.ADMIN
        ? this.adminModel
        : createUserDto.role === ROLE.EMPLOYEE
          ? this.employeeModel
          : createUserDto.role === ROLE.CUSTOMER
            ? this.customerModel
            : this.userModel;

    return await new modelToUse(createUserDto).save({ session });
  }

  update(_id: string, updateUserDto: UpdateUserDto, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, {
      new: true,
      runValidators: true,
      deleted: false,
      session,
    });
  }

  deleteById(_id: string, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      _id,
      { deleted: true },
      { session },
    );
  }

  restoreById(_id: string, session: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      _id,
      { deleted: false },
      { session },
    );
  }

  forceDelete(_id: string, session: ClientSession) {
    return this.userModel.findByIdAndDelete(_id, { session });
  }
}
