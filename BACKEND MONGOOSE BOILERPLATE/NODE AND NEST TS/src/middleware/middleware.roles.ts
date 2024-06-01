import { SetMetadata } from "@nestjs/common";
import { RESOURCE } from "src/constants";

export const Roles = (...roles: string[]) => SetMetadata(RESOURCE.ROLES, roles);
