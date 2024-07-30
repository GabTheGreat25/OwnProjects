import { createTransport } from "nodemailer";
import { ENV } from "../config";
import { RESOURCE } from "../constants";

export const transporter = createTransport({
  service: RESOURCE.GMAIL,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASSWORD,
  },
});
