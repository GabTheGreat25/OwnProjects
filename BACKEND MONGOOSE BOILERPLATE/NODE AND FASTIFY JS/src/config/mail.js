import { createTransport } from "nodemailer";
import { ENV } from "./index.js";
import { RESOURCE } from "../constants/index.js";

export const transporter = createTransport({
  service: RESOURCE.GMAIL,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASSWORD,
  },
});
