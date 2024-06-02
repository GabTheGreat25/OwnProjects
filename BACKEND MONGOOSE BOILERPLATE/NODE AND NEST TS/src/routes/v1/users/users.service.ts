import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

  async add(createUserDto: CreateUserDto) {
    const modelToUse =
      createUserDto.role === ROLE.ADMIN
        ? this.adminModel
        : createUserDto.role === ROLE.EMPLOYEE
          ? this.employeeModel
          : createUserDto.role === ROLE.CUSTOMER
            ? this.customerModel
            : this.userModel;

    return await new modelToUse(createUserDto).save();
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(_id, updateUserDto, { new: true });
  }

  deleteById(_id: string) {
    return this.userModel.findByIdAndUpdate(_id, { deleted: true });
  }

  restoreById(_id: string) {
    return this.userModel.findByIdAndUpdate(_id, { deleted: false });
  }

  forceDelete(_id: string) {
    return this.userModel.findByIdAndDelete(_id);
  }
}
