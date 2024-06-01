import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import {
  Admin,
  AdminSchema,
  Employee,
  EmployeeSchema,
  Customer,
  CustomerSchema,
} from "./discriminators";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
